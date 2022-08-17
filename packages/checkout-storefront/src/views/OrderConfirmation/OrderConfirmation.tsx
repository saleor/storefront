import { Suspense } from "react";

import PageHeader from "@/checkout-storefront/sections/PageHeader";
import { Summary, SummarySkeleton } from "@/checkout-storefront/sections/Summary";
import { OrderInfo } from "@/checkout-storefront/sections/OrderInfo";
import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout-storefront/hooks";
import { useOrder } from "@/checkout-storefront/hooks";

export const OrderConfirmation = ({ orderId }: { orderId: string }) => {
  const { order } = useOrder(orderId);
  const formatMessage = useFormattedMessages();

  return (
    <div className="page">
      <header>
        <PageHeader />
        <Text size="lg" weight="bold" className="mb-2">
          {formatMessage("orderConfirmationTitle", { number: order.number })}
        </Text>
        <Text size="md">
          {formatMessage("orderConfirmationSubtitle", {
            email: order.userEmail!,
          })}
        </Text>
      </header>
      <main className="order-content overflow-hidden">
        <OrderInfo order={order} />
        <div className="order-divider" />
        <Suspense fallback={<SummarySkeleton />}>
          <Summary
            {...order}
            totalPrice={order?.total}
            subtotalPrice={order?.subtotal}
            editable={false}
          />
        </Suspense>
      </main>
    </div>
  );
};
