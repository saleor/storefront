import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import React from "react";
import { AddressForm, AddressFormProps } from "./AddressForm";
import { AddressFormData, UserAddressFormData } from "./types";
import { useAddressList } from "@/checkout-storefront/sections/Addresses/AddressListProvider";

interface AddressEditFormProps extends Pick<AddressFormProps<AddressFormData>, "title"> {
  defaultValues: UserAddressFormData;
  onClose: () => void;
}

export const AddressEditForm: React.FC<AddressEditFormProps> = ({
  onClose,
  defaultValues,
  ...rest
}) => {
  const { setApiErrors, ...errorsRest } = useErrors<UserAddressFormData>();
  const { addressUpdate, addressDelete, updating, deleting } = useAddressList();

  const handleUpdate = async (formData: UserAddressFormData) => {
    const { hasErrors, errors } = await addressUpdate(formData);

    if (!hasErrors) {
      setApiErrors(errors);
      onClose();
    }
  };

  const handleDelete = async () => {
    const { hasErrors, errors } = await addressDelete(defaultValues.id);

    if (!hasErrors) {
      setApiErrors(errors);
      onClose();
    }
  };

  return (
    <AddressForm
      loading={updating || deleting}
      onSubmit={handleUpdate}
      onDelete={() => {
        void handleDelete();
      }}
      defaultValues={defaultValues}
      onCancel={onClose}
      // {...countrySelectProps}
      {...errorsRest}
      {...rest}
    />
  );
};
