import { Button } from "@/checkout/components/Button";
import { TextInput } from "@/checkout/components/TextInput";
import { useAddressValidationRulesQuery } from "@/checkout/graphql";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { UseErrors } from "@/checkout/hooks/useErrors";
import {
  MessageKey,
  useFormattedMessages,
} from "@/checkout/hooks/useFormattedMessages";
import { useGetInputProps } from "@/checkout/hooks/useGetInputProps";
import { useSetFormErrors } from "@/checkout/hooks/useSetFormErrors";
import { AddressField } from "@/checkout/lib/globalTypes";
import {
  getRequiredAddressFields,
  getSortedAddressFields,
  useValidationResolver,
} from "@/checkout/lib/utils";
import { useCountrySelect } from "@/checkout/providers/CountrySelectProvider";
import { forEach } from "lodash-es";
import { ReactNode, useEffect } from "react";
import {
  DefaultValues,
  FieldError,
  Path,
  Resolver,
  SubmitHandler,
  UnpackNestedValue,
  useForm,
} from "react-hook-form";
import { object, string } from "yup";
import { AddressFormData } from "./types";
import {
  AddressFormLayoutField,
  getAddressFormLayout,
  isAddressFieldRow,
} from "./utils";

export interface AddressFormProps<TFormData extends AddressFormData>
  extends Omit<UseErrors<TFormData>, "setApiErrors"> {
  defaultValues?: Partial<TFormData>;
  onCancel?: () => void;
  onSave: SubmitHandler<TFormData>;
}

export const AddressForm = <TFormData extends AddressFormData>({
  defaultValues,
  onCancel,
  onSave,
  errors,
  clearErrors: onClearErrors,
}: AddressFormProps<TFormData>) => {
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();
  const { countryCode } = useCountrySelect();

  const schema = object({
    firstName: string().required(errorMessages.required),
    lastName: string().required(errorMessages.required),
    streetAddress1: string().required(errorMessages.required),
    postalCode: string().required(errorMessages.required),
    city: string().required(errorMessages.required),
  });

  const resolver = useValidationResolver(schema);

  const {
    handleSubmit,
    watch,
    getValues,
    setError,
    formState,
    clearErrors,
    ...rest
  } = useForm<TFormData>({
    resolver: resolver as unknown as Resolver<TFormData, any>,
    mode: "onBlur",
    defaultValues: defaultValues as DefaultValues<TFormData>,
  });

  useSetFormErrors({ setError, errors });

  const getInputProps = useGetInputProps({ ...rest, formState });

  const [{ data }] = useAddressValidationRulesQuery({
    variables: { countryCode },
  });

  const validationRules = data?.addressValidationRules;

  const isFieldOptional = (field: AddressField) =>
    !getRequiredAddressFields(
      validationRules?.requiredFields! as AddressField[]
    ).includes(field);

  const handleCancel = () => {
    clearErrors();
    onClearErrors();

    if (onCancel) {
      onCancel();
    }
  };

  const handleSave = (address: UnpackNestedValue<TFormData>) => {
    onClearErrors();
    onSave(address);
  };

  const addressFormLayout = getAddressFormLayout(
    getSortedAddressFields(validationRules?.allowedFields! as AddressField[])
  );

  const mapAddressFields = (renderFn: (field: AddressField) => ReactNode) =>
    addressFormLayout.map((layoutField: AddressFormLayoutField) => {
      if (isAddressFieldRow(layoutField)) {
        return (
          <div
            key={(layoutField as AddressField[]).join()}
            className="w-full flex flex-row gap-3 justify-between"
          >
            {(layoutField as AddressField[]).map(renderFn)}
          </div>
        );
      }

      return renderFn(layoutField as AddressField);
    });

  return (
    <div>
      {mapAddressFields((field: AddressField) => (
        <TextInput
          key={field}
          label={formatMessage(field as MessageKey)}
          {...getInputProps(field as Path<TFormData>)}
          optional={isFieldOptional(field)}
        />
      ))}
      <div>
        {onCancel && (
          <Button
            className="mr-4"
            ariaLabel={formatMessage("cancelLabel")}
            variant="secondary"
            onClick={handleCancel}
            label={formatMessage("cancel")}
          />
        )}
        <Button
          ariaLabel={formatMessage("saveLabel")}
          onClick={handleSubmit(handleSave)}
          label={formatMessage("saveAddress")}
        />
      </div>
    </div>
  );
};
