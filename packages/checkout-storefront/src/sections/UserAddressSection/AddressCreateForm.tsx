import { ManualSaveAddressForm } from "@/checkout-storefront/components/ManualSaveAddressForm";
import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { useAddressList } from "@/checkout-storefront/sections/UserAddressSection/AddressListProvider";
import React from "react";
import { AddressFormProps } from "@/checkout-storefront/components/AddressForm";

export interface AddressCreateFormProps extends Pick<AddressFormProps, "title"> {
  onClose: () => void;
}

export const AddressCreateForm: React.FC<AddressCreateFormProps> = ({ onClose, ...rest }) => {
  const { addressCreate, creating } = useAddressList();
  const { ...errorsRest } = useErrors<AddressFormData>();

  return (
    <ManualSaveAddressForm
      onSubmit={addressCreate}
      onCancel={onClose}
      loading={creating}
      {...errorsRest}
      {...rest}
    />
  );
};
