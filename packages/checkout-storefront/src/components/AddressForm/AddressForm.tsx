import { CountryCode } from "@/checkout-storefront/graphql";
import { AddressField, AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { FC, PropsWithChildren, useEffect, useRef } from "react";
import { difference } from "lodash-es";
import { Title } from "@/checkout-storefront/components/Title";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { autocompleteTags, typeTags } from "@/checkout-storefront/lib/consts/inputAttributes";
import { CountrySelect } from "@/checkout-storefront/components/CountrySelect";
import { Select } from "@/checkout-storefront/components/Select";
import {
  getEmptyAddressFormData,
  isMatchingAddressFormData,
} from "@/checkout-storefront/components/AddressForm/utils";
import { BlurHandler, ChangeHandler, useFormContext } from "@/checkout-storefront/hooks/useForm";
import { useAddressFormUtils } from "@/checkout-storefront/components/AddressForm/useAddressFormUtils";
import { usePhoneNumberValidator } from "@/checkout-storefront/lib/utils/phoneNumber";
import { FieldValidator } from "formik";

export interface AddressFormProps {
  title: string;
  availableCountries?: CountryCode[];
  fieldProps?: {
    onBlur?: BlurHandler;
    onChange?: ChangeHandler;
  };
}

export const AddressForm: FC<PropsWithChildren<AddressFormProps>> = ({
  title,
  children,
  availableCountries,
  fieldProps = {},
}) => {
  const { values, setValues, dirty } = useFormContext<AddressFormData>();
  const isValidPhoneNumber = usePhoneNumberValidator(values.countryCode);
  const previousValues = useRef(values);

  const {
    orderedAddressFields,
    getFieldLabel,
    isRequiredField,
    countryAreaChoices,
    allowedFields,
  } = useAddressFormUtils(values.countryCode);

  const allowedFieldsRef = useRef(allowedFields || []);

  const customValidators: Partial<Record<AddressField, FieldValidator>> = {
    phone: isValidPhoneNumber,
  };

  // prevents outdated data to remain in the form when a field is
  // no longer allowed
  useEffect(() => {
    const hasFormDataChanged = !isMatchingAddressFormData(values, previousValues.current);

    if (!hasFormDataChanged) {
      return;
    }

    previousValues.current = values;

    const removedFields = difference(allowedFieldsRef.current, allowedFields);

    if (removedFields.length && dirty) {
      const emptyAddressFormData = getEmptyAddressFormData();

      void setValues(
        removedFields.reduce(
          (result, field) => ({
            ...result,
            [field]: emptyAddressFormData[field],
          }),
          values
        ),
        true
      );
    }
  }, [allowedFields, dirty, setValues, values]);

  return (
    <>
      <div className="flex flex-row justify-between items-baseline">
        <Title className="flex-1">{title}</Title>
        <CountrySelect only={availableCountries} />
      </div>
      <div className="mt-2">
        {orderedAddressFields.map((field) => {
          const isRequired = isRequiredField(field);
          const label = getFieldLabel(field);

          const commonProps = {
            key: field,
            name: field,
            label: label,
            autoComplete: autocompleteTags[field],
            optional: !isRequired,
            validate: customValidators[field],
            ...fieldProps,
          };

          if (field === "countryArea" && isRequired) {
            return (
              <Select
                {...commonProps}
                classNames={{ container: "mb-4" }}
                placeholder={getFieldLabel("countryArea")}
                options={
                  countryAreaChoices?.map(({ verbose, raw }) => ({
                    label: verbose as string,
                    value: raw as string,
                  })) || []
                }
              />
            );
          }

          return <TextInput {...commonProps} type={typeTags[field] || "text"} />;
        })}
        {children}
      </div>
    </>
  );
};
