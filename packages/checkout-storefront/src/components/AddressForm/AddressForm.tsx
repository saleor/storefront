import { CountryCode } from "@/checkout-storefront/graphql";
import { useAddressAvailability } from "@/checkout-storefront/hooks/useAddressAvailability";
import { Option, Select } from "@saleor/ui-kit";
import { UseErrors, useFormattedMessages, useGetInputProps } from "@/checkout-storefront/hooks";
import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { AddressField } from "@/checkout-storefront/lib/globalTypes";
import { Path, RegisterOptions, UseFormReturn } from "react-hook-form";
import { FC, PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { difference, sortBy } from "lodash-es";
import { Title } from "@/checkout-storefront/components/Title";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { useSetFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors";
import { autocompleteTags, countries } from "@/checkout-storefront/lib/consts";
import { useAddressFormUtils } from "@/checkout-storefront/hooks";
import { emptyFormData } from "@/checkout-storefront/lib/utils";
import { countriesMessages } from "@/checkout-storefront/components/AddressForm/messages";

interface CountryOption extends Option {
  value: CountryCode;
}

export interface AddressFormProps extends Pick<UseErrors<AddressFormData>, "errors"> {
  loading?: boolean;
  title: string;
  checkAddressAvailability?: boolean;
  formProps: UseFormReturn<AddressFormData>;
  defaultInputOptions?: RegisterOptions<AddressFormData, any>;
}

export const AddressForm: FC<PropsWithChildren<AddressFormProps>> = ({
  errors,
  title,
  children,
  checkAddressAvailability = false,
  formProps,
  defaultInputOptions = {},
}) => {
  const {
    setValue,
    watch,
    setError,
    trigger,
    formState: { isDirty },
  } = formProps;
  const formData = watch();
  const formatMessage = useFormattedMessages();
  const getInputProps = useGetInputProps(formProps, defaultInputOptions);
  const { isAvailable } = useAddressAvailability({ pause: !checkAddressAvailability });

  useSetFormErrors({ setError, errors });

  const countryOptions: CountryOption[] = useMemo(
    () =>
      sortBy(
        countries.map((code) => ({
          label: formatMessage(countriesMessages[code]),
          value: code,
          disabled: !isAvailable({ country: { code } }),
        })),
        "disabled"
      ),
    [formatMessage, isAvailable]
  );

  const {
    orderedAddressFields,
    getFieldLabel,
    isRequiredField,
    countryAreaChoices,
    allowedFields,
    requiredFields,
  } = useAddressFormUtils(formData.countryCode);

  const allowedFieldsRef = useRef(allowedFields || []);

  // prevents outdated data to remain in the form when a field is
  // no longer allowed
  useEffect(() => {
    const removedFields = difference(allowedFieldsRef.current, allowedFields);

    removedFields.forEach((field) => {
      setValue(field as Path<AddressFormData>, emptyFormData[field as Path<AddressFormData>]);
    });

    if (removedFields.length && isDirty) {
      void trigger();
    }
  }, [allowedFields, requiredFields, setValue, trigger, isDirty]);

  return (
    <form>
      <div className="flex flex-row justify-between items-baseline">
        <Title className="flex-1">{title}</Title>
        <Select
          classNames={{ container: "flex-1 inline-block !w-auto" }}
          options={countryOptions}
          {...getInputProps("countryCode")}
          autoComplete={autocompleteTags.countryCode}
        />
      </div>
      <div className="mt-2">
        {orderedAddressFields.map((field: AddressField) => {
          const isRequired = isRequiredField(field);
          const label = getFieldLabel(field);

          if (field === "countryArea" && isRequired) {
            return (
              <Select
                {...getInputProps("countryArea")}
                key={field}
                classNames={{ container: "mb-4" }}
                placeholder={getFieldLabel("countryArea")}
                autoComplete={autocompleteTags.countryArea}
                options={
                  countryAreaChoices?.map(({ verbose, raw }) => ({
                    label: verbose as string,
                    value: raw as string,
                  })) || []
                }
              />
            );
          }

          return (
            <TextInput
              key={field}
              label={label}
              autoComplete={autocompleteTags[field]}
              {...getInputProps(field as Path<AddressFormData>)}
              optional={!isRequired}
            />
          );
        })}
        {children}
      </div>
    </form>
  );
};
