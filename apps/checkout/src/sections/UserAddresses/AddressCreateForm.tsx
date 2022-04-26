import { useUserAddressCreateMutation } from "@/graphql";
import { extractMutationErrors } from "@/lib/utils";
import { useErrors } from "@/providers/ErrorsProvider";
import { AddressTypeEnum } from "@saleor/sdk/dist/apollo/types";
import React from "react";
import { AddressForm } from "./AddressForm";
import { AddressFormCommonProps, AddressFormData } from "./types";
import { getAddressInputData } from "./utils";

export interface AddressCreateFormProps extends AddressFormCommonProps {
  show: boolean;
  type: AddressTypeEnum;
  onClose: () => void;
}

export const AddressCreateForm: React.FC<AddressCreateFormProps> = ({
  countryCode,
  show,
  type,
  onClose,
}) => {
  const [, userAddressCreate] = useUserAddressCreateMutation();

  const { setApiErrors, ...errorsRest } =
    useErrors<AddressFormData>("userAddressCreate");

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
      countryCode={countryCode}
      onCancel={onClose}
      {...errorsRest}
    />
  );
};
