import { Button } from "@components/Button";
import { TextInput } from "@components/TextInput";
import { CountryCode, useAddressValidationRulesQuery } from "@graphql";
import { useGetInputProps } from "@hooks/useGetInputProps";
import { AddressField } from "@lib/globalTypes";
import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";
import { AddressFormData } from "./types";

interface UserAddressFormProps<TFormData extends AddressFormData> {
  countryCode: CountryCode;
  defaultValues?: DefaultValues<TFormData>;
  onCancel?: () => void;
  onSave: SubmitHandler<TFormData>;
}

export const UserAddressForm = <TFormData extends AddressFormData>({
  countryCode,
  defaultValues,
  onCancel,
  onSave,
}: UserAddressFormProps<TFormData>) => {
  const { handleSubmit, watch, getValues, ...rest } = useForm<TFormData>({
    mode: "onBlur",
    defaultValues,
  });

  const getInputProps = useGetInputProps(rest);

  const [{ data }] = useAddressValidationRulesQuery({
    variables: { countryCode },
  });

  const validationRules = data?.addressValidationRules;

  return (
    <div>
      {/* TMP */}
      {(validationRules?.allowedFields as Partial<AddressField>[])?.map(
        (field: AddressField) => (
          <TextInput
            label={field}
            // @ts-ignore TMP
            {...getInputProps(field)}
            optional={!validationRules?.requiredFields?.includes(field)}
          />
        )
      )}
      <div className="boo">
        {onCancel && (
          <Button
            ariaLabel="cancel"
            variant="secondary"
            onClick={onCancel}
            title="cancel"
          />
        )}
        <Button ariaLabel="save" onClick={handleSubmit(onSave)} title="Save" />
      </div>
    </div>
  );
};
