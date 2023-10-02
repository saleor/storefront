import { Suspense } from "react";

import { PageHeader } from "@/checkout/sections/PageHeader";
import { Summary, SummarySkeleton } from "@/checkout/sections/Summary";
import { OrderInfo } from "@/checkout/sections/OrderInfo";
import { orderInfoMessages } from "@/checkout/sections/OrderInfo/messages";
import { useOrder } from "@/checkout/hooks/useOrder";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";

export const OrderConfirmation = () => {
	const { order } = useOrder();
	const formatMessage = useFormattedMessages();

	return (
		<div className="page">
			<header>
				<PageHeader />
				<p className="mb-2 text-lg font-bold" data-testid="orderConfrmationTitle">
					{formatMessage(orderInfoMessages.orderConfirmTitle, { number: order.number })}
				</p>
				<p className="text-base">
					{formatMessage(orderInfoMessages.orderConfirmSubtitle, {
						email: order.userEmail || "",
					})}
				</p>
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
