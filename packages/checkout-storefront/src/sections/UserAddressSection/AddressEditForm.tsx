import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import React from "react";
import { AddressFormData, UserAddressFormData } from "../../components/AddressForm/types";
import { useAddressList } from "@/checkout-storefront/sections/UserAddressSection/AddressListProvider";
import { ManualSaveAddressForm } from "@/checkout-storefront/components/ManualSaveAddressForm";
import { AddressFormProps } from "@/checkout-storefront/components/AddressForm";

interface AddressEditFormProps extends Pick<AddressFormProps, "title"> {
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

  const handleUpdate = async (formData: AddressFormData) => {
    const { hasErrors, errors } = await addressUpdate({ ...formData, id: defaultValues.id });

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
    <ManualSaveAddressForm
      loading={updating || deleting}
      onSubmit={handleUpdate}
      onDelete={handleDelete}
      defaultValues={defaultValues}
      onCancel={onClose}
      {...errorsRest}
      {...rest}
    />
  );
};
