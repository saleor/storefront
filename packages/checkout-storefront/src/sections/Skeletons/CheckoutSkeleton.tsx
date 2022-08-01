import React from "react";
import { Button } from "@/checkout-storefront/components/Button";
import { Divider } from "@/checkout-storefront/components/Divider";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { AddressesSkeleton } from "./AddressesSkeleton";
import { ContactSkeleton } from "./ContactSkeleton";
import { SummarySkeleton } from "./SummarySkeleton";
import { DeliveryMethodsSkeleton } from "./DeliveryMethodsSkeleton";
import { PaymentSectionSkeleton } from "./PaymentSectionSkeleton";

interface CheckoutSkeletonProps {}

export const CheckoutSkeleton: React.FC<CheckoutSkeletonProps> = ({}) => {
  const formatMessage = useFormattedMessages();

  return (
    <div className="app">
      <div className="page">
        <div className="page-content">
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

          <div className="page-divider" />
          <SummarySkeleton />
        </div>
      </div>
    </div>
  );
};
