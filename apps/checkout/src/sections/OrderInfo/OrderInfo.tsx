import { OrderFragment } from "@/checkout/graphql";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";

import { Address } from "./Address";
import { DeliverySection } from "./DeliverySection";
import { PaymentSection } from "./PaymentSection";
import { Section, SectionTitle } from "./Section";

export const OrderInfo = ({ order }: { order: OrderFragment }) => {
  const formatMessage = useFormattedMessages();

  return (
    <section className="flex-grow">
      <PaymentSection orderId={order.id} />
      <DeliverySection deliveryMethod={order.deliveryMethod} />
      {order.shippingAddress && (
        <Section>
          <SectionTitle>{formatMessage("shippingAddress")}</SectionTitle>
          <Address address={order.shippingAddress} />
        </Section>
      )}
      <Section>
        <SectionTitle>{formatMessage("billingAddress")}</SectionTitle>
        <Address address={order.billingAddress!} />
      </Section>
    </section>
  );
};
