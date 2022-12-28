import { AddressForm } from "@/checkout-storefront/components/AddressForm";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";
import { shippingMessages } from "@/checkout-storefront/sections/UserShippingAddressSection/messages";
import { useAvailableShippingCountries } from "@/checkout-storefront/hooks/useAvailableShippingCountries";
import { useGuestShippingAddressForm } from "@/checkout-storefront/sections/GuestShippingAddressSection/useGuestShippingAddressForm";
import React from "react";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { BlurHandler } from "@/checkout-storefront/lib/globalTypes";

export const GuestShippingAddressSection = () => {
  const formatMessage = useFormattedMessages();
  const { availableShippingCountries } = useAvailableShippingCountries();

  const form = useGuestShippingAddressForm();

  const { handleSubmit, handleBlur } = form;

  const onBlur: BlurHandler = (event) => {
    handleBlur(event);
    handleSubmit();
  };

  return (
    <FormProvider form={form}>
      <AddressForm
        title={formatMessage(shippingMessages.shippingAddress)}
        availableCountries={availableShippingCountries}
        fieldProps={{
          onBlur,
        }}
      />
    </FormProvider>
  );
};
