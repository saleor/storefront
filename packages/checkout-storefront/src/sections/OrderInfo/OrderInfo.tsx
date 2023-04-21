import { Address } from "@/checkout-storefront/components/Address";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useOrder } from "@/checkout-storefront/hooks/useOrder";
import { contactMessages } from "@/checkout-storefront/sections/Contact/messages";
import { billingMessages } from "@/checkout-storefront/sections/UserBillingAddressSection/messages";
import { shippingMessages } from "@/checkout-storefront/sections/UserShippingAddressSection/messages";
import { Text } from "@saleor/ui-kit";

import { DeliverySection } from "./DeliverySection";
import { PaymentSection } from "./PaymentSection";
import { Section } from "./Section";

export const OrderInfo = () => {
  const formatMessage = useFormattedMessages();

  const {
    order: { deliveryMethod, shippingAddress, billingAddress, userEmail },
  } = useOrder();

  return (
    <section className="lg:w-1/2 border border-border-secondary rounded-lg pt-5 px-4">
      <PaymentSection />
      <DeliverySection deliveryMethod={deliveryMethod} />
      <Section title={formatMessage(contactMessages.contact)}>
        <Text>{userEmail}</Text>
      </Section>
      {shippingAddress && (
        <Section title={formatMessage(shippingMessages.shippingAddress)}>
          <Address address={shippingAddress} />
        </Section>
      )}
      {billingAddress && (
        <Section title={formatMessage(billingMessages.billingAddress)}>
          <Address address={billingAddress} />
        </Section>
      )}
    </section>
  );
};
