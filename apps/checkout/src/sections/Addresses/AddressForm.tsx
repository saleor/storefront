import { Button } from "@/checkout/components/Button";
import { TextInput } from "@/checkout/components/TextInput";
import {
  CountryCode,
  useAddressValidationRulesQuery,
} from "@/checkout/graphql";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import {
  MessageKey,
  useFormattedMessages,
} from "@/checkout/hooks/useFormattedMessages";
import { useGetInputProps } from "@/checkout/hooks/useGetInputProps";
import { AddressField } from "@/checkout/lib/globalTypes";
import {
  getRequiredAddressFields,
  getSortedAddressFields,
  useValidationResolver,
} from "@/checkout/lib/utils";
import { useCountrySelect } from "@/checkout/providers/CountrySelectProvider";
import { ErrorScope, useErrors } from "@/checkout/providers/ErrorsProvider";
import { useSetFormErrors } from "@/checkout/providers/ErrorsProvider/useSetFormErrors";
import { ReactNode } from "react";
import {
  DefaultValues,
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

export interface AddressFormProps<TFormData extends AddressFormData> {
  errorScope: ErrorScope;
  defaultValues?: Partial<TFormData>;
  onCancel?: () => void;
  onSave: SubmitHandler<TFormData>;
}

export const AddressForm = <TFormData extends AddressFormData>({
  defaultValues,
  onCancel,
  onSave,
  errorScope,
}: AddressFormProps<TFormData>) => {
  const { clearErrors: clearContextErrors } = useErrors(errorScope);
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();
  const { countryCode } = useCountrySelect();

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

  useSetFormErrors<TFormData>({ errorScope, setError });

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
    clearContextErrors();

    if (onCancel) {
      onCancel();
    }
  };

  const handleSave = (address: UnpackNestedValue<TFormData>) => {
    clearContextErrors();
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
