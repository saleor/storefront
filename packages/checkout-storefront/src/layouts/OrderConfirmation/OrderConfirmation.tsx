import { Suspense } from "react";

import PageHeader from "@/checkout-storefront/sections/PageHeader";
import { FinalizedSummary, SummarySkeleton } from "@/checkout-storefront/sections/Summary";
import { OrderInfo } from "@/checkout-storefront/sections/OrderInfo";
import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout-storefront/hooks";
import { Divider, Title } from "@/checkout-storefront/components";
import { useOrder } from "@/checkout-storefront/hooks";

export const OrderConfirmation = ({ orderId }: { orderId: string }) => {
  const { order } = useOrder(orderId);
  const formatMessage = useFormattedMessages();

  return (
    <div className="page">
      <header className="order-header">
        <PageHeader />
        <Title>{formatMessage("orderConfirmationTitle", { number: order.number })}</Title>
        <Text size="md" className="max-w-[692px]">
          {formatMessage("orderConfirmationSubtitle", {
            email: order.userEmail!,
          })}
        </Text>
      </header>
      <Divider />
      <main className="order-content overflow-hidden">
        <OrderInfo order={order} />
        <div className="order-divider" />
        <Suspense fallback={<SummarySkeleton />}>
          <FinalizedSummary order={order} />
        </Suspense>
      </main>
    </div>
  );
};
