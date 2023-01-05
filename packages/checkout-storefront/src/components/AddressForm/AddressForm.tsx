import { CountryCode } from "@/checkout-storefront/graphql";
import { Option, Select } from "@saleor/ui-kit";
import { UseErrors, useFormattedMessages, useGetInputProps } from "@/checkout-storefront/hooks";
import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { Path, RegisterOptions, UseFormReturn } from "react-hook-form";
import { FC, PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { difference, omit } from "lodash-es";
import { Title } from "@/checkout-storefront/components/Title";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { useSetFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors/useSetFormErrors";
import { autocompleteTags, typeTags } from "@/checkout-storefront/lib/consts/inputAttributes";
import { useAddressFormUtils } from "@/checkout-storefront/hooks";
import { emptyFormData, isMatchingAddressFormData } from "@/checkout-storefront/lib/utils";
import { countriesMessages } from "@/checkout-storefront/components/AddressForm/messages";
import { useAvailableShippingCountries } from "@/checkout-storefront/hooks/useAvailableShippingCountries";

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
  const previousFormData = useRef(formData);
  const formatMessage = useFormattedMessages();
  const getInputProps = useGetInputProps(formProps, defaultInputOptions);
  const { availableShippingCountries } = useAvailableShippingCountries();

  useSetFormErrors({ setError, errors });

  const countryOptions: CountryOption[] = useMemo(
    () =>
      availableShippingCountries
        .sort((a, b) => a.localeCompare(b))
        .map((code) => ({
          label: formatMessage(countriesMessages[code]),
          value: code,
        })),
    [formatMessage, availableShippingCountries]
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
    const hasFormDataChanged = !isMatchingAddressFormData(formData, previousFormData.current);

    if (!hasFormDataChanged) {
      return;
    }

    previousFormData.current = formData;

    const removedFields = difference(allowedFieldsRef.current, allowedFields);

    removedFields.forEach((field) => {
      setValue(field as Path<AddressFormData>, emptyFormData[field as Path<AddressFormData>]);
    });

    const isFormDirty =
      isDirty && Object.values(omit(formData, ["countryCode", "id"])).some((value) => !!value);

    if (removedFields.length && isFormDirty) {
      void trigger();
    }
  }, [allowedFields, requiredFields, setValue, trigger, isDirty, formData]);

  return (
    <form method="post">
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
        {orderedAddressFields.map((field) => {
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
              type={typeTags[field] || "text"}
              optional={!isRequired}
            />
          );
        })}
        {children}
      </div>
    </form>
  );
};
