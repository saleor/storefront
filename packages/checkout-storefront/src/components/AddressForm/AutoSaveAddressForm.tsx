import { AddressForm, AddressFormProps } from "@/checkout-storefront/components/AddressForm";
import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import {
  useAddressForm,
  UseAddressFormProps,
} from "@/checkout-storefront/components/AddressForm/useAddressForm";
import { useFormDebouncedSubmit } from "@/checkout-storefront/hooks/useFormDebouncedSubmit";
import React from "react";

type AutoSaveAddressFormProps = UseAddressFormProps &
  Omit<AddressFormProps, "formProps" | "defaultInputOptions" | "children">;

export const AutoSaveAddressForm: React.FC<AutoSaveAddressFormProps> = ({
  defaultValues,
  onSubmit,
  ...addressFormRest
}) => {
  const { formProps, onSubmit: handleSubmit } = useAddressForm({ defaultValues, onSubmit });
  const { getValues } = formProps;

  const debouncedSubmit = useFormDebouncedSubmit<AddressFormData>({
    defaultFormData: defaultValues,
    onSubmit: handleSubmit,
  });

  const handleChange = () => debouncedSubmit(getValues());

  return (
    <AddressForm
      {...addressFormRest}
      defaultInputOptions={{ onChange: handleChange }}
      formProps={formProps}
    />
  );
};
