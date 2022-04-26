import { useUserAddressUpdateMutation } from "@/graphql";
import { extractMutationErrors } from "@/lib/utils";
import { useErrors } from "@/providers/ErrorsProvider";
import React from "react";
import { AddressForm, AddressFormProps } from "./AddressForm";
import { AddressFormCommonProps, UserAddressFormData } from "./types";
import { getAddressInputData } from "./utils";

interface AddressEditFormProps
  extends AddressFormCommonProps,
    Pick<AddressFormProps<UserAddressFormData>, "defaultValues"> {
  onClose: () => void;
  show: boolean;
}

export const AddressEditForm: React.FC<AddressEditFormProps> = ({
  onClose,
  countryCode,
  show,
  defaultValues,
}) => {
  const [, userAddressUpdate] = useUserAddressUpdateMutation();

  const { setApiErrors, ...errorsRest } =
    useErrors<UserAddressFormData>("userAddressUpdate");

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
      defaultValues={defaultValues}
      onCancel={onClose}
      {...errorsRest}
    />
  );
};
