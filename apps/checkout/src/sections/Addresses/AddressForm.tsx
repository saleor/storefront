import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { CountryCode, useAddressValidationRulesQuery } from "@/graphql";
import { useErrorMessages } from "@/hooks/useErrorMessages";
import { MessageKey, useFormattedMessages } from "@/hooks/useFormattedMessages";
import { useGetInputProps } from "@/hooks/useGetInputProps";
import { AddressField } from "@/lib/globalTypes";
import {
  getRequiredAddressFields,
  getSortedAddressFields,
  useValidationResolver,
} from "@/lib/utils";
import { UseErrorsProps } from "@/providers/ErrorsProvider";
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
  extends Pick<
    UseErrorsProps<TFormData>,
    "errors" | "hasErrors" | "setErrors" | "clearErrors"
  > {
  countryCode: CountryCode;
  defaultValues?: Partial<TFormData>;
  onCancel?: () => void;
  onSave: SubmitHandler<TFormData>;
}

export const AddressForm = <TFormData extends AddressFormData>({
  countryCode,
  defaultValues,
  onCancel,
  onSave,
  hasErrors,
  errors,
  clearErrors: onCleanErrors,
}: AddressFormProps<TFormData>) => {
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();

  const schema = object({
    firstName: string().required(errorMessages.requiredValue),
    lastName: string().required(errorMessages.requiredValue),
    streetAddress1: string().required(errorMessages.requiredValue),
    postalCode: string().required(errorMessages.requiredValue),
    city: string().required(errorMessages.requiredValue),
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

  useEffect(() => {
    if (hasErrors) {
      forEach(errors, (error, key) => {
        setError(key as Path<TFormData>, {
          message: (error as unknown as FieldError).message,
        });
      });
    }
  }, [errors]);

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
    onCleanErrors();

    if (onCancel) {
      onCancel();
    }
  };

  const handleSave = (address: UnpackNestedValue<TFormData>) => {
    onCleanErrors();
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
