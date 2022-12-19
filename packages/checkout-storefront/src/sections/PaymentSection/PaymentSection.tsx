import { Divider } from "@/checkout-storefront/components/Divider";
import { Title } from "@/checkout-storefront/components/Title";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { PaymentMethods } from "./PaymentMethods";
import { BillingAddressSection } from "../BillingAddressSection/BillingAddressSection";
import { CommonSectionProps } from "@/checkout-storefront/lib/globalTypes";
import { paymentSectionMessages } from "./messages";

export const PaymentSection: React.FC<CommonSectionProps> = ({ collapsed }) => {
  const formatMessage = useFormattedMessages();

  if (collapsed) {
    return null;
  }

  return (
    <>
      <Divider />
      <div className="section" data-testid="paymentMethods">
        <Title>{formatMessage(paymentSectionMessages.paymentProviders)}</Title>
        <PaymentMethods />
        <BillingAddressSection />
      </div>
    </>
  );
};
