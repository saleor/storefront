import React from "react";
import { Button } from "./components/Button";
import { Divider } from "./components/Divider";
import { useFormattedMessages } from "./hooks/useFormattedMessages";
import { AddressesSkeleton } from "./sections/Addresses";
import { ContactSkeleton } from "./sections/Contact";
import { ShippingMethodsSkeleton } from "./sections/ShippingMethods";
import { SummarySkeleton } from "./sections/Summary/SummarySkeleton";

interface CheckoutSkeletonProps {}

export const CheckoutSkeleton: React.FC<CheckoutSkeletonProps> = ({}) => {
  const formatMessage = useFormattedMessages();

  return (
    <div className="app">
      <div className="page">
        <div className="page-content">
          <div className="checkout-form">
            <ContactSkeleton />
            <Divider className="mt-4" />
            <AddressesSkeleton />
            <ShippingMethodsSkeleton />
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
