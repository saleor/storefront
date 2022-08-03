import { CountryCode, useUserAddressCreateMutation } from "@/checkout-storefront/graphql";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { extractMutationErrors } from "@/checkout-storefront/lib/utils";
import { AddressTypeEnum } from "@saleor/sdk/dist/apollo/types";
import React from "react";
import { AddressForm, AddressFormProps } from "./AddressForm";
import { AddressFormData } from "./types";
import { getAddressInputData } from "./utils";

export interface AddressCreateFormProps
  extends Pick<AddressFormProps<AddressFormData>, "countryCode" | "setCountryCode" | "title"> {
  show: boolean;
  type: AddressTypeEnum;
  onClose: () => void;
  onSuccess: (createdAddressId: string) => void;
  countryCode: CountryCode;
}

export const AddressCreateForm: React.FC<AddressCreateFormProps> = ({
  show,
  type,
  onClose,
  onSuccess,
  ...rest
}) => {
  const { showErrors } = useAlerts("userAddressCreate");
  const [, userAddressCreate] = useUserAddressCreateMutation();

  const { setApiErrors, ...errorsRest } = useErrors<AddressFormData>();

  const handleSubmit = async (address: AddressFormData) => {
    const result = await userAddressCreate({
      address: getAddressInputData({
        ...address,
      }),
      type,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (!hasErrors) {
      onSuccess(result.data?.accountAddressCreate?.address?.id as string);
      onClose();
      return;
    }

    showErrors(errors);
    setApiErrors(errors);
  };

  if (!show) {
    return null;
  }

  return <AddressForm onSubmit={handleSubmit} onCancel={onClose} {...errorsRest} {...rest} />;
};
