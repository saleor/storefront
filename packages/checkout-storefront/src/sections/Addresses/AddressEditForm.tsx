import { AddressFragment } from "@/checkout-storefront/graphql";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import React from "react";
import { AddressForm, AddressFormProps } from "./AddressForm";
import { AddressFormData, UserAddressFormData } from "./types";
import { useCountrySelect } from "@/checkout-storefront/hooks/useErrors/useCountrySelect";
import { useAddressList } from "@/checkout-storefront/sections/Addresses/AddressListProvider";

interface AddressEditFormProps
  extends Pick<AddressFormProps<UserAddressFormData>, "defaultValues">,
    Pick<AddressFormProps<AddressFormData>, "title"> {
  onClose: () => void;
}

export const AddressEditForm: React.FC<AddressEditFormProps> = ({
  onClose,
  defaultValues,
  ...rest
}) => {
  const { setApiErrors, ...errorsRest } = useErrors<UserAddressFormData>();
  const { addressUpdate, addressDelete, updating, deleting } = useAddressList();

  const countrySelectProps = useCountrySelect({
    autoSelect: !defaultValues?.countryCode,
    selectedCountryCode: defaultValues?.countryCode,
  });

  const handleUpdate = async (formData: UserAddressFormData) => {
    const { hasErrors, errors } = await addressUpdate(formData);

    if (!hasErrors) {
      setApiErrors(errors);
      onClose();
    }
  };

  const handleDelete = async () => {
    const { hasErrors, errors } = await addressDelete(defaultValues?.id as string);

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
      {...countrySelectProps}
      {...errorsRest}
      {...rest}
    />
  );
};
