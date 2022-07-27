import { useUserAddressCreateMutation } from "@/checkout-storefront/graphql";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { extractMutationErrors } from "@/checkout-storefront/lib/utils";
import { useCountrySelect } from "@/checkout-storefront/providers/CountrySelectProvider";
import { AddressTypeEnum } from "@saleor/sdk/dist/apollo/types";
import React from "react";
import { AddressForm } from "./AddressForm";
import { AddressFormData } from "./types";
import { getAddressInputData } from "./utils";

export interface AddressCreateFormProps {
  show: boolean;
  type: AddressTypeEnum;
  onClose: () => void;
}

export const AddressCreateForm: React.FC<AddressCreateFormProps> = ({ show, type, onClose }) => {
  const { showSuccess, showErrors } = useAlerts("userAddressCreate");
  const [, userAddressCreate] = useUserAddressCreateMutation();

  const { countryCode } = useCountrySelect();

  const { setApiErrors, ...errorsRest } = useErrors<AddressFormData>();

  const handleSubmit = async (address: AddressFormData) => {
    const result = await userAddressCreate({
      address: getAddressInputData({
        ...address,
        countryCode,
      }),
      type,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (!hasErrors) {
      showSuccess();
      onClose();
      return;
    }

    showErrors(errors);
    setApiErrors(errors);
  };

  if (!show) {
    return null;
  }

  return <AddressForm onSave={handleSubmit} onCancel={onClose} {...errorsRest} />;
};
