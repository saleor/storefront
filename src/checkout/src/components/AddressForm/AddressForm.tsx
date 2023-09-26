import { type CountryCode } from "@/checkout/src/graphql";
import { type AddressField, type AddressFormData } from "@/checkout/src/components/AddressForm/types";
import { type FC, type PropsWithChildren, useEffect, useRef } from "react";
import { difference } from "lodash-es";
import { Title } from "@/checkout/src/components/Title";
import { TextInput } from "@/checkout/src/components/TextInput";
import { autocompleteTags, typeTags } from "@/checkout/src/lib/consts/inputAttributes";
import { CountrySelect } from "@/checkout/src/components/CountrySelect";
import { Select } from "@/checkout/src/components/Select";
import {
  getEmptyAddressFormData,
  isMatchingAddressFormData,
} from "@/checkout/src/components/AddressForm/utils";
import { type BlurHandler, type ChangeHandler, useFormContext } from "@/checkout/src/hooks/useForm";
import { useAddressFormUtils } from "@/checkout/src/components/AddressForm/useAddressFormUtils";
import { usePhoneNumberValidator } from "@/checkout/src/lib/utils/phoneNumber";
import { type FieldValidator } from "formik";

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
      <div className="flex flex-row justify-between items-baseline mb-3">
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
            optional: isRequired ? undefined : true,
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
