import { AddressForm } from "@/checkout-storefront/components/AddressForm";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";
import { shippingMessages } from "@/checkout-storefront/sections/UserShippingAddressSection/messages";
import { useAvailableShippingCountries } from "@/checkout-storefront/hooks/useAvailableShippingCountries";
import { useGuestShippingAddressForm } from "@/checkout-storefront/sections/GuestShippingAddressSection/useGuestShippingAddressForm";
import React from "react";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { Field } from "formik";
import { ChangeHandler } from "@/checkout-storefront/hooks/useForm";

export const GuestShippingAddressSection = () => {
  const formatMessage = useFormattedMessages();
  const { availableShippingCountries } = useAvailableShippingCountries();

  const form = useGuestShippingAddressForm();

  const { handleSubmit, handleChange } = form;

  const onChange: ChangeHandler = (event) => {
    handleChange(event);
    handleSubmit();
  };

  return (
    <FormProvider form={form}>
      <Field />
      <AddressForm
        title={formatMessage(shippingMessages.shippingAddress)}
        availableCountries={availableShippingCountries}
        fieldProps={{
          onChange,
        }}
      />
    </FormProvider>
  );
};
