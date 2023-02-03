import { AddressForm } from "@/checkout-storefront/components/AddressForm";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";
import { useGuestBillingAddressForm } from "@/checkout-storefront/sections/GuestBillingAddressSection/useGuestBillingAddressForm";
import React, { Suspense } from "react";
import { billingMessages } from "@/checkout-storefront/sections/UserBillingAddressSection/messages";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { AddressSectionSkeleton } from "@/checkout-storefront/components/AddressSectionSkeleton";
import { useBillingSameAsShippingForm } from "@/checkout-storefront/sections/GuestBillingAddressSection/useBillingSameAsShippingForm";
import { Checkbox } from "@/checkout-storefront/components";

export const GuestBillingAddressSection = () => {
  const formatMessage = useFormattedMessages();
  const {
    checkout: { isShippingRequired },
  } = useCheckout();

  const billingSameAsShippingForm = useBillingSameAsShippingForm({ autoSave: true });

  const {
    values: { billingSameAsShipping },
  } = billingSameAsShippingForm;

  // we want to avoid validating this form on "pay" click when it's not visible
  const form = useGuestBillingAddressForm({ skipValidation: billingSameAsShipping });

  const { handleBlur, handleChange } = form;

  return (
    <Suspense fallback={<AddressSectionSkeleton />}>
      {isShippingRequired && (
        <FormProvider form={billingSameAsShippingForm}>
          <Checkbox
            classNames={{ container: "!mb-0" }}
            name="billingSameAsShipping"
            label={formatMessage(billingMessages.useShippingAsBilling)}
            data-testid={"useShippingAsBillingCheckbox"}
          />
        </FormProvider>
      )}
      {!billingSameAsShipping && (
        <FormProvider form={form}>
          <AddressForm
            title={formatMessage(billingMessages.billingAddress)}
            fieldProps={{
              onChange: handleChange,
              onBlur: handleBlur,
            }}
          />
        </FormProvider>
      )}
    </Suspense>
  );
};
