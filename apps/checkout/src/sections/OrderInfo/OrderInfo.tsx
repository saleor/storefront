import { OrderFragment } from "@/graphql";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";

import { Address } from "./Address";
import { DeliverySection } from "./DeliverySection";
import { PaymentSection } from "./PaymentSection";
import { Section, SectionTitle } from "./Section";

export const OrderInfo = ({ order }: { order: OrderFragment }) => {
  const formatMessage = useFormattedMessages();

  return (
    <section className="flex-grow">
      <PaymentSection
        isPaid={order.isPaid}
        paymentStatus={order.paymentStatus}
      />
      <DeliverySection deliveryMethod={order.deliveryMethod} />
      <Section>
        <SectionTitle>{formatMessage("shippingAddress")}</SectionTitle>
        <Address address={order.shippingAddress!} />
      </Section>
      <Section>
        <SectionTitle>{formatMessage("billingAddress")}</SectionTitle>
        <Address address={order.billingAddress!} />
      </Section>
    </section>
  );
};
