import {
  AddressFormData,
  UserAddressFormData,
} from "@/checkout-storefront/components/AddressForm/types";
import React from "react";
import { AddressForm, AddressFormProps } from "@/checkout-storefront/components/AddressForm";
import {
  AddressFragment,
  useUserAddressDeleteMutation,
  useUserAddressUpdateMutation,
} from "@/checkout-storefront/graphql";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";
import { useFormattedMessages } from "@/checkout-storefront/hooks";
import {
  getAddressInputData,
  getUserAddressFormDataFromAddress,
} from "@/checkout-storefront/components/AddressForm/utils";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { AddressFormActions } from "@/checkout-storefront/components/ManualSaveAddressForm";

export interface AddressEditFormProps extends Pick<AddressFormProps, "title"> {
  address: AddressFragment;
  onUpdate: (address: AddressFragment) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const AddressEditForm: React.FC<AddressEditFormProps> = ({
  onUpdate,
  onClose,
  onDelete,
  address,
}) => {
  const formatMessage = useFormattedMessages();
  const [{ fetching: updating }, userAddressUpdate] = useUserAddressUpdateMutation();
  const [{ fetching: deleting }, userAddressDelete] = useUserAddressDeleteMutation();

  const { onSubmit } = useSubmit<UserAddressFormData, typeof userAddressUpdate>({
    scope: "userAddressUpdate",
    onSubmit: userAddressUpdate,
    parse: ({ id, ...formData }) => ({ id, address: { ...getAddressInputData(formData) } }),
    onSuccess: ({ result }) => onUpdate(result.data?.accountAddressEdit?.address),
  });

  const { onSubmit: onAddressDelete } = useSubmit<{ id: string }, typeof userAddressDelete>({
    scope: "userAddressDelete",
    onSubmit: userAddressDelete,
    parse: ({ id }) => ({ id }),
    onSuccess: ({ formData: { id } }) => onDelete(id),
  });

  const form = useForm<AddressFormData>({
    initialValues: getUserAddressFormDataFromAddress(address),
    onSubmit,
  });

  const { handleSubmit } = form;

  return (
    <FormProvider value={form}>
      <AddressForm title={formatMessage("editAddress")} {...form}>
        <AddressFormActions
          onSubmit={handleSubmit}
          loading={updating || deleting}
          onCancel={onClose}
          onDelete={onAddressDelete}
        />
      </AddressForm>
    </FormProvider>
  );
};
