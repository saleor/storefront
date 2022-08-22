import { Address } from "@/checkout-storefront/components/Address";
import { OrderFragment } from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
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
      <Section title={formatMessage("contact")}>
        <Text>{order?.userEmail}</Text>
      </Section>
      {order.shippingAddress && (
        <Section title={formatMessage("shippingAddress")}>
          <Address address={order.shippingAddress} />
        </Section>
      )}
      <Section title={formatMessage("billingAddress")}>
        <Address address={order.billingAddress!} />
      </Section>
    </section>
  );
};
