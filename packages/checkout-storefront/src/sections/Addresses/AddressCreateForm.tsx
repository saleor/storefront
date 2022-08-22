import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { useCountrySelect } from "@/checkout-storefront/hooks/useErrors/useCountrySelect";
import { useAddressList } from "@/checkout-storefront/sections/Addresses/AddressListProvider";
import { AddressTypeEnum } from "@saleor/sdk/dist/apollo/types";
import React from "react";
import { AddressForm, AddressFormProps } from "./AddressForm";
import { AddressFormData } from "./types";

export interface AddressCreateFormProps extends Pick<AddressFormProps<AddressFormData>, "title"> {
  type: AddressTypeEnum;
  onClose: () => void;
}

export const AddressCreateForm: React.FC<AddressCreateFormProps> = ({ type, onClose, ...rest }) => {
  const { addressCreate, creating } = useAddressList();
  const { setApiErrors, ...errorsRest } = useErrors<AddressFormData>();

  const countrySelectProps = useCountrySelect({
    autoSelect: true,
  });

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
      {...countrySelectProps}
      {...errorsRest}
      {...rest}
    />
  );
};
