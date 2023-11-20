import { Divider } from "@/checkout-storefront/components/Divider";
import { Title } from "@/checkout-storefront/components/Title";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { PaymentMethods } from "./PaymentMethods";
import React from "react";
import { PaymentSectionProps } from "@/checkout-storefront/lib/globalTypes";
import { paymentSectionMessages } from "./messages";

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  children,
  isOnReceiveSelected,
  isOnInpostSelected,
  isLockerIdSelected,
}) => {
  const formatMessage = useFormattedMessages();

  return (
    <>
      <Divider />
      <div className="section" data-testid="paymentMethods">
        <Title>{formatMessage(paymentSectionMessages.paymentMethods)}</Title>
        <PaymentMethods
          isLockerIdSelected={isLockerIdSelected}
          isOnReceiveSelected={isOnReceiveSelected}
          isOnInpostSelected={isOnInpostSelected}
        />
        {children}
      </div>
    </>
  );
};
