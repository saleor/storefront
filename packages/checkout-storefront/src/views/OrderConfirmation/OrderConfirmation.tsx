import { Suspense } from "react";

import { PageHeader } from "@/checkout-storefront/sections/PageHeader";
import { Summary, SummarySkeleton } from "@/checkout-storefront/sections/Summary";
import { OrderInfo } from "@/checkout-storefront/sections/OrderInfo";
import { Text } from "@saleor/ui-kit";
import { orderInfoMessages } from "@/checkout-storefront/sections/OrderInfo/messages";
import { useOrder } from "@/checkout-storefront/hooks/useOrder";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";

export const OrderConfirmation = () => {
  const { order } = useOrder();
  const formatMessage = useFormattedMessages();

  return (
    <div className="page">
      <header>
        <PageHeader />
        <Text size="lg" weight="bold" className="mb-2" data-testid="orderConfrmationTitle">
          {formatMessage(orderInfoMessages.orderConfirmTitle, { number: order.number })}
        </Text>
        <Text size="md">
          {formatMessage(orderInfoMessages.orderConfirmSubtitle, {
            email: order.userEmail || "",
          })}
        </Text>
      </header>
      <main className="order-content overflow-hidden">
        <OrderInfo />
        <div className="order-divider" />
        <Suspense fallback={<SummarySkeleton />}>
          <Summary
            {...order}
            // for now there can only be one voucher per order in the api
            discount={order?.discounts?.find(({ type }) => type === "VOUCHER")?.amount}
            voucherCode={order?.voucher?.code}
            totalPrice={order?.total}
            subtotalPrice={order?.subtotal}
            editable={false}
          />
        </Suspense>
      </main>
    </div>
  );
};
