import { AddressForm } from "@/checkout-storefront/components/AddressForm";
import { getAddressFormDataFromAddress } from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckout, useFormattedMessages } from "@/checkout-storefront/hooks";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";
import { billingMessages } from "@/checkout-storefront/sections/BillingAddressSection/messages";
import { useGuestBillingAddressForm } from "@/checkout-storefront/sections/BillingAddressSection/useBillingAddressForm";
import React from "react";

export const GuestBillingAddressForm = () => {
  const formatMessage = useFormattedMessages();
  const { checkout } = useCheckout();

  const form = useGuestBillingAddressForm({
    initialValues: getAddressFormDataFromAddress(checkout.billingAddress),
  });

  // const [passDefaultFormDataAddress, setPassDefaultFormDataAddress] = useState<boolean>(
  //   !!billingAddress
  // );

  // useEffect(() => {
  //   const billingSetDifferentThanShipping =
  //     !isBillingSameAsShipping && isBillingSameAsShippingRef.current;

  //   if (billingSetDifferentThanShipping) {
  //     setPassDefaultFormDataAddress(false);
  //     isBillingSameAsShippingRef.current = isBillingSameAsShipping;
  //   }
  // }, [isBillingSameAsShipping]);

  return (
    <FormProvider form={form}>
      <AddressForm title={formatMessage(billingMessages.billingAddress)} {...form} />
    </FormProvider>
  );
};
