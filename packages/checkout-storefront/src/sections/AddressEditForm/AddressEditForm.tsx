import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import React from "react";
import { AddressForm, AddressFormProps } from "@/checkout-storefront/components/AddressForm";
import {
  AddressFragment,
  useUserAddressDeleteMutation,
  useUserAddressUpdateMutation,
} from "@/checkout-storefront/graphql";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import {
  getAddressFormDataFromAddress,
  getAddressInputData,
} from "@/checkout-storefront/components/AddressForm/utils";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { AddressFormActions } from "@/checkout-storefront/components/ManualSaveAddressForm";
import { addressEditMessages } from "@/checkout-storefront/sections/AddressEditForm/messages";
import { useAddressFormSchema } from "@/checkout-storefront/components/AddressForm/useAddressFormSchema";

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
  const validationSchema = useAddressFormSchema();
  const [{ fetching: updating }, userAddressUpdate] = useUserAddressUpdateMutation();
  const [{ fetching: deleting }, userAddressDelete] = useUserAddressDeleteMutation();

  const onSubmit = useFormSubmit<AddressFormData, typeof userAddressUpdate>({
    scope: "userAddressUpdate",
    onSubmit: userAddressUpdate,
    parse: (formData) => ({ id: address.id, address: { ...getAddressInputData(formData) } }),
    onSuccess: ({ result }) => onUpdate(result.data?.accountAddressEdit?.address),
  });

  const { onSubmit: onAddressDelete } = useFormSubmit<{ id: string }, typeof userAddressDelete>({
    scope: "userAddressDelete",
    onSubmit: userAddressDelete,
    parse: ({ id }) => ({ id }),
    onSuccess: ({ formData: { id } }) => onDelete(id),
  });

  const form = useForm<AddressFormData>({
    validationSchema,
    initialValues: getAddressFormDataFromAddress(address),
    onSubmit,
  });

  const { handleSubmit } = form;

  return (
    <FormProvider form={form}>
      <AddressForm title={formatMessage(addressEditMessages.editAddress)}>
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
