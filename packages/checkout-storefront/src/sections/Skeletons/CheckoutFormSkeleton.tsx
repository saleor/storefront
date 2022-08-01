import React from "react";
import { Button } from "@/checkout-storefront/components/Button";
import { Divider } from "@/checkout-storefront/components/Divider";
import { AddressesSkeleton } from "./AddressesSkeleton";
import { ContactSkeleton } from "./ContactSkeleton";
import { DeliveryMethodsSkeleton } from "./DeliveryMethodsSkeleton";
import { PaymentSectionSkeleton } from "./PaymentSectionSkeleton";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";

export const CheckoutFormSkeleton = () => {
  const formatMessage = useFormattedMessages();

  return (
    <div className="checkout-form-container">
      <div className="checkout-form">
        <ContactSkeleton />
        <Divider />
        <AddressesSkeleton />
        <Divider />
        <DeliveryMethodsSkeleton />
        <Divider />
        <PaymentSectionSkeleton />
      </div>
      <Button
        disabled
        ariaLabel={formatMessage("finalizeCheckoutLabel")}
        label={formatMessage("pay")}
        className="pay-button"
      />
    </div>
  );
};
