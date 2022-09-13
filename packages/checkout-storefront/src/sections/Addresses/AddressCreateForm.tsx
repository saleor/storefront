import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { useAddressList } from "@/checkout-storefront/sections/Addresses/AddressListProvider";
import React from "react";
import { AddressForm, AddressFormProps } from "./AddressForm";
import { AddressFormData } from "./types";

export interface AddressCreateFormProps extends Pick<AddressFormProps<AddressFormData>, "title"> {
  onClose: () => void;
}

export const AddressCreateForm: React.FC<AddressCreateFormProps> = ({ onClose, ...rest }) => {
  const { addressCreate, creating } = useAddressList();
  const { setApiErrors, ...errorsRest } = useErrors<AddressFormData>();

  const handleSubmit = async (formData: AddressFormData) => {
    const { hasErrors, errors } = await addressCreate(formData);

    if (!hasErrors) {
      setApiErrors(errors);
      onClose();
    }
  };

  return (
    <AddressForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      loading={creating}
      {...errorsRest}
      {...rest}
    />
  );
};
