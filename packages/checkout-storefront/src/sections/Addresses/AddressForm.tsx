import { Button } from "@/checkout-storefront/components/Button";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { useAddressValidationRulesQuery } from "@/checkout-storefront/graphql";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { UseErrors } from "@/checkout-storefront/hooks/useErrors";
import { MessageKey, useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import { useSetFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors";
import { AddressField } from "@/checkout-storefront/lib/globalTypes";
import {
  getRequiredAddressFields,
  getSortedAddressFields,
  useValidationResolver,
} from "@/checkout-storefront/lib/utils";
import { useCountrySelect } from "@/checkout-storefront/providers/CountrySelectProvider";
import { ReactNode, useState } from "react";
import { DefaultValues, Path, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { object, string } from "yup";
import { AddressFormData } from "./types";
import { Select } from "@saleor/ui-kit";
import { warnAboutMissingTranslation } from "@/checkout-storefront/hooks/useFormattedMessages/utils";

export interface AddressFormProps<TFormData extends AddressFormData>
  extends Omit<UseErrors<TFormData>, "setApiErrors"> {
  defaultValues?: Partial<TFormData>;
  onCancel?: () => void;
  onSave: SubmitHandler<TFormData>;
  autoSave?: boolean;
}

export const AddressForm = <TFormData extends AddressFormData>({
  defaultValues,
  onCancel,
  onSave,
  errors,
  clearErrors: onClearErrors,
  autoSave = false,
}: AddressFormProps<TFormData>) => {
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();
  const { countryCode } = useCountrySelect();
  const [countryArea, setCountryArea] = useState<string>("");

  const schema = object({
    firstName: string().required(errorMessages.required),
    lastName: string().required(errorMessages.required),
    streetAddress1: string().required(errorMessages.required),
    postalCode: string().required(errorMessages.required),
    city: string().required(errorMessages.required),
  });

  const resolver = useValidationResolver(schema);

  const { handleSubmit, watch, getValues, setError, formState, clearErrors, ...rest } =
    useForm<TFormData>({
      resolver: resolver as unknown as Resolver<TFormData, any>,
      mode: "onBlur",
      defaultValues: defaultValues as DefaultValues<TFormData>,
    });

  useSetFormErrors({ setError, errors });

  const getInputProps = useGetInputProps({
    ...rest,
    formState,
  });

  const [{ data }] = useAddressValidationRulesQuery({
    variables: { countryCode },
  });

  const validationRules = data?.addressValidationRules;

  const isRequiredField = (field: AddressField) =>
    getRequiredAddressFields(validationRules?.requiredFields! as AddressField[]).includes(field);

  const handleCancel = () => {
    clearErrors();
    onClearErrors();

    if (onCancel) {
      onCancel();
    }
  };

  const handleSave = (address: TFormData) => {
    onClearErrors();
    onSave(countryArea ? { ...address, countryArea } : address);
  };

  const getLocalizedFieldName = (field: AddressField, localizedField?: string | null) => {
    try {
      const translatedLabel = formatMessage(localizedField as MessageKey);
      return translatedLabel;
    } catch (e) {
      warnAboutMissingTranslation(localizedField as string);
      return formatMessage(field as MessageKey);
    }
  };

  const getFieldLabel = (field: AddressField) => {
    const { countryAreaType, postalCodeType, cityType } = validationRules || {};

    const localizedFields: Partial<Record<AddressField, string | undefined>> = {
      countryArea: countryAreaType,
      city: cityType,
      postalCode: postalCodeType,
    };

    const isLocalizedField = Object.keys(localizedFields).includes(field);

    if (!isLocalizedField) {
      return formatMessage(field as MessageKey);
    }

    return getLocalizedFieldName(field, localizedFields[field]);
  };

  const sortedAddressFields = getSortedAddressFields(
    validationRules?.allowedFields! as AddressField[]
  );

  const handleAutoSave = () => {
    const formData = getValues();
    onSave(formData);
  };

  return (
    <div>
      {sortedAddressFields.map((field: AddressField) => {
        const isRequired = isRequiredField(field);
        const label = getFieldLabel(field);

        if (field === "countryArea" && isRequired) {
          return (
            <Select
              classNames={{ container: "mb-4" }}
              placeholder={label}
              onChange={setCountryArea}
              selectedValue={countryArea}
              options={
                validationRules?.countryAreaChoices.map(({ verbose, raw }) => ({
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
            {...getInputProps(field as Path<TFormData>, {
              onBlur: handleAutoSave,
            })}
            optional={!isRequired}
          />
        );
      })}
      {!autoSave && (
        <div className="flex flex-row justify-end">
          <Button
            className="mr-4"
            ariaLabel={formatMessage("cancelLabel")}
            variant="secondary"
            onClick={handleCancel}
            label={formatMessage("cancel")}
          />
          <Button
            ariaLabel={formatMessage("saveLabel")}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleSubmit(handleSave)}
            label={formatMessage("saveAddress")}
          />
        </div>
      )}
    </div>
  );
};
