import { AddressForm } from "@/checkout-storefront/components/AddressForm";
import { getAddressFormDataFromAddress } from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckout, useFormattedMessages } from "@/checkout-storefront/hooks";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";
import { shippingMessages } from "@/checkout-storefront/sections/UserShippingAddressSection/messages";
import { useAvailableShippingCountries } from "@/checkout-storefront/hooks/useAvailableShippingCountries";
import { useGuestShippingAddressForm } from "@/checkout-storefront/sections/GuestShippingAddressSection/useGuestShippingAddressForm";
import React from "react";

export const GuestShippingAddressSection = () => {
  const formatMessage = useFormattedMessages();
  const { checkout } = useCheckout();
  const { availableShippingCountries } = useAvailableShippingCountries();

  const form = useGuestShippingAddressForm({
    initialValues: getAddressFormDataFromAddress(checkout.shippingAddress),
  });

  return (
    <FormProvider value={form}>
      <AddressForm
        title={formatMessage(shippingMessages.shippingAddress)}
        availableCountries={availableShippingCountries}
        {...form}
      />
    </FormProvider>
  );
};
