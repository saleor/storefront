import { useUserAddressUpdateMutation } from "@/checkout/graphql";
import { extractMutationErrors } from "@/checkout/lib/utils";
import { useCountrySelect } from "@/checkout/providers/CountrySelectProvider";
import { useErrors } from "@/checkout/hooks/useErrors";
import React from "react";
import { AddressForm, AddressFormProps } from "./AddressForm";
import { UserAddressFormData } from "./types";
import { useCheckoutAddressUpdate } from "./useCheckoutAddressUpdate";
import { getAddressInputData } from "./utils";
import { useAlerts } from "@/checkout/hooks/useAlerts";

interface AddressEditFormProps
  extends Pick<AddressFormProps<UserAddressFormData>, "defaultValues"> {
  onClose: () => void;
  show: boolean;
}

export const AddressEditForm: React.FC<AddressEditFormProps> = ({
  onClose,
  show,
  defaultValues,
}) => {
  const [, userAddressUpdate] = useUserAddressUpdateMutation();
  const { updateShippingAddress } = useCheckoutAddressUpdate();
  const { showErrors, showSuccess } = useAlerts("userAddressUpdate");

  const { countryCode } = useCountrySelect();

  const { setApiErrors, ...errorsRest } = useErrors<UserAddressFormData>();

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
      showSuccess();
      await updateShippingAddress(address);
      onClose();
      return;
    }

    showErrors(errors);
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
      {...errorsRest}
    />
  );
};
