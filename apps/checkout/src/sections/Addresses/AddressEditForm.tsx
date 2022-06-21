import { useUserAddressUpdateMutation } from "@/checkout/graphql";
import { extractMutationErrors } from "@/checkout/lib/utils";
import { useCountrySelect } from "@/checkout/providers/CountrySelectProvider";
import { ErrorScope, useErrors } from "@/checkout/providers/ErrorsProvider";
import React from "react";
import { AddressForm, AddressFormProps } from "./AddressForm";
import { UserAddressFormData } from "./types";
import { useCheckoutAddressUpdate } from "./useCheckoutAddressUpdate";
import { getAddressInputData } from "./utils";

interface AddressEditFormProps
  extends Pick<AddressFormProps<UserAddressFormData>, "defaultValues"> {
  onClose: () => void;
  show: boolean;
}

const ERROR_SCOPE: ErrorScope = "userAddressUpdate";

export const AddressEditForm: React.FC<AddressEditFormProps> = ({
  onClose,
  show,
  defaultValues,
}) => {
  const [, userAddressUpdate] = useUserAddressUpdateMutation();
  const { updateShippingAddress } = useCheckoutAddressUpdate();

  const { countryCode } = useCountrySelect();

  const { setApiErrors } = useErrors<UserAddressFormData>(ERROR_SCOPE);

  const handleSubmit = async (address: UserAddressFormData) => {
    const result = await userAddressUpdate({
      address: getAddressInputData({
        ...address,
        countryCode,
      }),
      id: address.id,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (!hasErrors) {
      updateShippingAddress(address);
      onClose();
      return;
    }

    setApiErrors(errors);
  };

  if (!show) {
    return null;
  }

  return (
    <AddressForm
      onSave={handleSubmit}
      defaultValues={defaultValues}
      onCancel={onClose}
      errorScope={ERROR_SCOPE}
    />
  );
};
