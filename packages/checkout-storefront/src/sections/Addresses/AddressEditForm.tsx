import { CountryCode, useUserAddressUpdateMutation } from "@/checkout-storefront/graphql";
import { extractMutationErrors } from "@/checkout-storefront/lib/utils";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import React from "react";
import { AddressForm, AddressFormProps } from "./AddressForm";
import { AddressFormData, UserAddressFormData } from "./types";
import { getAddressInputData } from "./utils";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";

interface AddressEditFormProps
  extends Pick<AddressFormProps<UserAddressFormData>, "defaultValues">,
    Pick<AddressFormProps<AddressFormData>, "countryCode" | "setCountryCode" | "title"> {
  onClose: () => void;
  show: boolean;
  onSuccess: (addressId: string) => void;
}

export const AddressEditForm: React.FC<AddressEditFormProps> = ({
  onClose,
  show,
  defaultValues,
  onSuccess,
  ...rest
}) => {
  const [, userAddressUpdate] = useUserAddressUpdateMutation();
  const { showErrors } = useAlerts("userAddressUpdate");

  const { setApiErrors, ...errorsRest } = useErrors<UserAddressFormData>();

  const handleSubmit = async (address: UserAddressFormData) => {
    const result = await userAddressUpdate({
      address: getAddressInputData({
        ...address,
      }),
      id: address.id,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (!hasErrors) {
      onSuccess(address.id);
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
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      onCancel={onClose}
      {...errorsRest}
      {...rest}
    />
  );
};
