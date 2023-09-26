import { AddressForm } from "@/checkout/src/components/AddressForm";
import { FormProvider } from "@/checkout/src/hooks/useForm/FormProvider";
import { shippingMessages } from "@/checkout/src/sections/UserShippingAddressSection/messages";
import { useAvailableShippingCountries } from "@/checkout/src/hooks/useAvailableShippingCountries";
import { useGuestShippingAddressForm } from "@/checkout/src/sections/GuestShippingAddressSection/useGuestShippingAddressForm";
import React from "react";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";

export const GuestShippingAddressSection = () => {
  const formatMessage = useFormattedMessages();
  const { availableShippingCountries } = useAvailableShippingCountries();

  const form = useGuestShippingAddressForm();

  const { handleChange, handleBlur } = form;

  return (
    <FormProvider form={form}>
      <AddressForm
        title={formatMessage(shippingMessages.shippingAddress)}
        availableCountries={availableShippingCountries}
        fieldProps={{
          onChange: handleChange,
          onBlur: handleBlur,
        }}
      />
    </FormProvider>
  );
};
