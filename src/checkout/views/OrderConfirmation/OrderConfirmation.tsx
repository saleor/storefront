import { Suspense } from "react";

import { PageHeader } from "@/checkout/sections/PageHeader";
import { Summary, SummarySkeleton } from "@/checkout/sections/Summary";
import { OrderInfo } from "@/checkout/sections/OrderInfo";
import { useOrder } from "@/checkout/hooks/useOrder";

export const OrderConfirmation = () => {
	const { order } = useOrder();

	return (
		<main className="grid grid-cols-1 gap-x-16 lg:grid-cols-2">
			<div>
				<header>
					<PageHeader />
					<p className="mb-2 text-lg font-bold" data-testid="orderConfrmationTitle">
						Order #{order.number} confirmed
					</p>
					<p className="text-base">
						Thank you for placing your order. We&apos;ve received it and we will contact you as soon as your
						package is shipped. A confirmation email has been sent to {order.userEmail}.
					</p>
				</header>
				<OrderInfo />
			</div>
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
	);
};
