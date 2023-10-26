import { Divider } from "@/checkout-storefront/components/Divider";
import { Title } from "@/checkout-storefront/components/Title";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { PaymentMethods } from "./PaymentMethods";
import React, { ReactNode } from "react";
import { Children } from "@/checkout-storefront/lib/globalTypes";
import { paymentSectionMessages } from "./messages";

interface PaymentSectionProps extends Children {
  selectedCourier: string;
  children: ReactNode | ReactNode[];
}

export const PaymentSection = ({ children, selectedCourier }: PaymentSectionProps) => {
  const formatMessage = useFormattedMessages();

  return (
    <>
      <Divider />
      <div className="section" data-testid="paymentMethods">
        <Title>{formatMessage(paymentSectionMessages.paymentMethods)}</Title>
        <PaymentMethods selectedCourier={selectedCourier} />
        {children}
      </div>
    </>
  );
};
