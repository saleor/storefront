import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import React from "react";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import {
  getEmptyAddressFormData,
  getAddressInputData,
} from "@/checkout-storefront/components/AddressForm/utils";
import { ChangeHandler, useForm } from "@/checkout-storefront/hooks/useForm";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { AddressFormActions } from "@/checkout-storefront/components/ManualSaveAddressForm";
import { addressCreateMessages } from "@/checkout-storefront/sections/AddressCreateForm/messages";
import { useAddressFormSchema } from "@/checkout-storefront/components/AddressForm/useAddressFormSchema";
import { AddressForm, AddressFormProps } from "@/checkout-storefront/components/AddressForm";
import {
  AddressFragment,
  CountryCode,
  useUserAddressCreateMutation,
} from "@/checkout-storefront/graphql";
import { FormProvider } from "@/checkout-storefront/hooks/useForm/FormProvider";

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
  const [, userAddressCreate] = useUserAddressCreateMutation();
  const { setCountryCode, validationSchema } = useAddressFormSchema();

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

  const { handleSubmit, isSubmitting, handleChange } = form;

  const onChange: ChangeHandler = (event) => {
    const { name, value } = event.target;

    if (name === "countryCode") {
      setCountryCode(value as CountryCode);
    }

    handleChange(event);
  };

  return (
    <FormProvider form={{ ...form, handleChange: onChange }}>
      <AddressForm
        title={formatMessage(addressCreateMessages.addressCreate)}
        availableCountries={availableCountries}
      >
        <AddressFormActions onSubmit={handleSubmit} loading={isSubmitting} onCancel={onClose} />
      </AddressForm>
    </FormProvider>
  );
};
