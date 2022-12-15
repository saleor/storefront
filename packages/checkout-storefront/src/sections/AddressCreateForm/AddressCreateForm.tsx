import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import React from "react";
import { AddressForm } from "@/checkout-storefront/components/AddressForm";
import { AddressFragment, useUserAddressCreateMutation } from "@/checkout-storefront/graphql";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";
import { useFormattedMessages } from "@/checkout-storefront/hooks";
import {
  emptyAddressFormData,
  getAddressInputData,
} from "@/checkout-storefront/components/AddressForm/utils";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { AddressFormActions } from "@/checkout-storefront/components/ManualSaveAddressForm";

export interface AddressCreateFormProps {
  onSuccess: (address: AddressFragment) => void;
  onClose: () => void;
}

export const AddressCreateForm: React.FC<AddressCreateFormProps> = ({ onSuccess, onClose }) => {
  const formatMessage = useFormattedMessages();
  const [, userAddressCreate] = useUserAddressCreateMutation();

  const { onSubmit } = useSubmit<AddressFormData, typeof userAddressCreate>({
    scope: "userAddressCreate",
    onSubmit: userAddressCreate,
    parse: (addressFormData) => ({ address: getAddressInputData(addressFormData) }),
    onSuccess: ({ result }) => onSuccess(result.data?.accountAddressCreate?.address),
  });

  const form = useForm<AddressFormData>({
    initialValues: emptyAddressFormData,
    onSubmit,
  });

  const { handleSubmit, isSubmitting } = form;

  return (
    <FormProvider form={form}>
      <AddressForm title={formatMessage("createAddress")} {...form}>
        <AddressFormActions onSubmit={handleSubmit} loading={isSubmitting} onCancel={onClose} />
      </AddressForm>
    </FormProvider>
  );
};
