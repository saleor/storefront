import { Divider } from "@/checkout-storefront/components/Divider";
import { Title } from "@/checkout-storefront/components/Title";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import React from "react";
import { invoiceSectionMessages } from "./messages";
import { InvoiceRequestCheckbox } from "@/checkout-storefront/components/InvoiceRequestCheckbox/InvoiceRequestCheckbox";
import { CommonSectionProps } from "@/checkout-storefront/lib/globalTypes";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";

export const InvoiceRequestSection: React.FC<CommonSectionProps> = ({ collapsed }) => {
  const { checkout } = useCheckout();
  const formatMessage = useFormattedMessages();

  if (!checkout?.isShippingRequired || collapsed) {
    return null;
  }

  const handleInvoiceChange = (invoice: boolean) => {
    console.log("test", invoice);
  };

  return (
    <>
      <Divider />
      <div className="section" data-testid="paymentMethods">
        <Title>{formatMessage(invoiceSectionMessages.title)}</Title>
        <InvoiceRequestCheckbox onInvoiceChange={handleInvoiceChange} />
      </div>
    </>
  );
};
