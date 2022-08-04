import {
  AddressFragment,
  CountryCode,
  useUserAddressCreateMutation,
} from "@/checkout-storefront/graphql";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { useCountrySelect } from "@/checkout-storefront/hooks/useErrors/useCountrySelect";
import { extractMutationErrors } from "@/checkout-storefront/lib/utils";
import { AddressTypeEnum } from "@saleor/sdk/dist/apollo/types";
import React from "react";
import { AddressForm, AddressFormProps } from "./AddressForm";
import { AddressFormData } from "./types";
import { getAddressInputData } from "./utils";

export interface AddressCreateFormProps extends Pick<AddressFormProps<AddressFormData>, "title"> {
  type: AddressTypeEnum;
  onClose: () => void;
  onSuccess: (createdAddress: AddressFragment) => void;
}

export const AddressCreateForm: React.FC<AddressCreateFormProps> = ({
  type,
  onClose,
  onSuccess,
  ...rest
}) => {
  const { showErrors } = useAlerts("userAddressCreate");
  const [, userAddressCreate] = useUserAddressCreateMutation();
  const { setApiErrors, ...errorsRest } = useErrors<AddressFormData>();

  const countrySelectProps = useCountrySelect({
    autoSelect: true,
  });

  const handleSubmit = async (address: AddressFormData) => {
    const result = await userAddressCreate({
      address: getAddressInputData({
        ...address,
      }),
      type,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (!hasErrors) {
      onSuccess(result.data?.accountAddressCreate?.address as AddressFragment);
      onClose();
      return;
    }

    showErrors(errors);
    setApiErrors(errors);
  };

  return (
    <AddressForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      {...countrySelectProps}
      {...errorsRest}
      {...rest}
    />
  );
};
