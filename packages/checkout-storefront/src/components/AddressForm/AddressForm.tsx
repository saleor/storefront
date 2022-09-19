import { CountryCode } from "@/checkout-storefront/graphql";
import { useAddressAvailability } from "@/checkout-storefront/hooks/useAddressAvailability";
import { Option, Select } from "@saleor/ui-kit";
import { UseErrors, useGetInputProps } from "@/checkout-storefront/hooks";
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
  const getInputProps = useGetInputProps(formProps, defaultInputOptions);
  const { isAvailable } = useAddressAvailability({ pause: !checkAddressAvailability });

  useSetFormErrors({ setError, errors });

  const countryOptions: CountryOption[] = useMemo(
    () =>
      sortBy(
        countries.map(({ code, name }) => ({
          label: name,
          value: code,
          disabled: !isAvailable({ country: { code } }),
        })),
        "disabled"
      ),
    [isAvailable]
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

    if (isDirty) {
      void trigger();
    }
  }, [allowedFields, requiredFields, setValue]);

  return (
    <form>
      <div className="flex flex-row justify-between items-baseline">
        <Title>{title}</Title>
        <Select
          width="1/2"
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
