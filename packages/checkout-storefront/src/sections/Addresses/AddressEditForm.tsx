import {
  AddressFragment,
  CountryCode,
  useUserAddressDeleteMutation,
  useUserAddressUpdateMutation,
} from "@/checkout-storefront/graphql";
import { extractMutationErrors } from "@/checkout-storefront/lib/utils";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import React from "react";
import { AddressForm, AddressFormProps } from "./AddressForm";
import { AddressFormData, UserAddressFormData } from "./types";
import { getAddressInputData } from "./utils";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useCountrySelect } from "@/checkout-storefront/hooks/useErrors/useCountrySelect";

interface AddressEditFormProps
  extends Pick<AddressFormProps<UserAddressFormData>, "defaultValues">,
    Pick<AddressFormProps<AddressFormData>, "title"> {
  onClose: () => void;
  onSuccess: (address: AddressFragment) => void;
}

export const AddressEditForm: React.FC<AddressEditFormProps> = ({
  onClose,
  defaultValues,
  onSuccess,
  ...rest
}) => {
  const [{ fetching: updating }, userAddressUpdate] = useUserAddressUpdateMutation();
  const [{ fetching: deleting }, userAddressDelete] = useUserAddressDeleteMutation();
  const { showErrors } = useAlerts("userAddressUpdate");
  const { setApiErrors, ...errorsRest } = useErrors<UserAddressFormData>();

  const countrySelectProps = useCountrySelect({
    autoSelect: !defaultValues?.countryCode,
    selectedCountryCode: defaultValues?.countryCode,
  });

  const onUpdate = async (address: UserAddressFormData) => {
    const result = await userAddressUpdate({
      address: getAddressInputData({
        ...address,
      }),
      id: address.id,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (!hasErrors) {
      onSuccess(result.data?.accountAddressUpdate?.address as AddressFragment);
      onClose();
      return;
    }

    showErrors(errors);
    setApiErrors(errors);
  };

  const onDelete = async () => {
    const result = await userAddressDelete({
      id: defaultValues?.id as string,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (!hasErrors) {
      onClose();
      return;
    }

    showErrors(errors);
    setApiErrors(errors);
  };

  return (
    <AddressForm
      loading={updating || deleting}
      onSubmit={onUpdate}
      onDelete={() => {
        void onDelete();
      }}
      defaultValues={defaultValues}
      onCancel={onClose}
      {...countrySelectProps}
      {...errorsRest}
      {...rest}
    />
  );
};
