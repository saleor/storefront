import { Address } from "@/checkout-storefront/components/Address";
import { OrderFragment } from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { billingMessages } from "@/checkout-storefront/sections/BillingAddressSection/messages";
import { contactMessages } from "@/checkout-storefront/sections/Contact/messages";
import { shippingMessages } from "@/checkout-storefront/sections/ShippingAddressSection/messages";
import { Text } from "@saleor/ui-kit";

import { DeliverySection } from "./DeliverySection";
import { PaymentSection } from "./PaymentSection";
import { Section } from "./Section";

export const OrderInfo = ({ order }: { order: OrderFragment }) => {
  const formatMessage = useFormattedMessages();

  return (
    <section className="lg:w-1/2 border border-border-secondary rounded-lg pt-5 px-4">
      <PaymentSection orderId={order.id} />
      <DeliverySection deliveryMethod={order.deliveryMethod} />
      <Section title={formatMessage(contactMessages.contact)}>
        <Text>{order?.userEmail}</Text>
      </Section>
      {order.shippingAddress && (
        <Section title={formatMessage(shippingMessages.shippingAddress)}>
          <Address address={order.shippingAddress} />
        </Section>
      )}
      <Section title={formatMessage(billingMessages.billingAddress)}>
        <Address address={order.billingAddress!} />
      </Section>
    </section>
  );
};
