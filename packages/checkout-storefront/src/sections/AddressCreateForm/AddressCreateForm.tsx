import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import React from "react";
import { AddressForm, AddressFormProps } from "@/checkout-storefront/components/AddressForm";
import { AddressFragment, useUserAddressCreateMutation } from "@/checkout-storefront/graphql";
import { FormProvider } from "@/checkout-storefront/hooks/useForm/FormProvider";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import {
  getEmptyAddressFormData,
  getAddressInputData,
} from "@/checkout-storefront/components/AddressForm/utils";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { AddressFormActions } from "@/checkout-storefront/components/ManualSaveAddressForm";
import { addressCreateMessages } from "@/checkout-storefront/sections/AddressCreateForm/messages";
import { useAddressFormSchema } from "@/checkout-storefront/components/AddressForm/useAddressFormSchema";

export interface AddressCreateFormProps extends Pick<AddressFormProps, "availableCountries"> {
  onSuccess: (address: AddressFragment) => void;
  onClose: () => void;
}

export const AddressCreateForm: React.FC<AddressCreateFormProps> = ({
  onSuccess,
  onClose,
  availableCountries,
}) => {
  const formatMessage = useFormattedMessages();
  const validationSchema = useAddressFormSchema();
  const [, userAddressCreate] = useUserAddressCreateMutation();

  const onSubmit = useFormSubmit<AddressFormData, typeof userAddressCreate>({
    scope: "userAddressCreate",
    onSubmit: userAddressCreate,
    parse: (addressFormData) => ({ address: getAddressInputData(addressFormData) }),
    onSuccess: ({ data }) => {
      onSuccess(data.address as AddressFragment);
      onClose();
    },
  });

  const form = useForm<AddressFormData>({
    validationSchema,
    initialValues: getEmptyAddressFormData(),
    onSubmit,
  });

  const { handleSubmit, isSubmitting } = form;

  return (
    <FormProvider form={form}>
      <AddressForm
        title={formatMessage(addressCreateMessages.addressCreate)}
        availableCountries={availableCountries}
      >
        <AddressFormActions onSubmit={handleSubmit} loading={isSubmitting} onCancel={onClose} />
      </AddressForm>
    </FormProvider>
  );
};
