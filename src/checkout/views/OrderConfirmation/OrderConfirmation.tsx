import { Suspense, useMemo } from "react";
import { Summary, SummarySkeleton } from "@/checkout/sections/Summary";
import { OrderInfo } from "@/checkout/sections/OrderInfo";
import { useOrder } from "@/checkout/hooks/useOrder";

export const OrderConfirmation = () => {
	const { order } = useOrder();

	// Check if order contains any digital products
	const hasDigitalProducts = useMemo(() => {
		return (
			order?.lines?.some((line) => {
				// Type guard: Check if variant has product with productType
				const variant = line.variant as any;
				return variant?.product?.productType?.isDigital === true;
			}) ?? false
		);
	}, [order?.lines]);

	return (
		<main className="grid grid-cols-1 gap-x-16 lg:grid-cols-2">
			<div>
				<header>
					<p className="mb-2 text-lg font-bold" data-testid="orderConfrmationTitle">
						Order #{order.number} confirmed
					</p>
					<p className="text-base">
						Thank you for placing your order. We&apos;ve received it and we will contact you as soon as your
						package is shipped. A confirmation email has been sent to {order.userEmail}.
					</p>
				</header>

				{/* Digital Products Notification */}
				{hasDigitalProducts && (
					<div className="my-6 rounded-md border border-blue-200 bg-blue-50 p-4">
						<h3 className="mb-2 font-medium text-blue-900">Digital Products Included</h3>
						<p className="text-sm text-blue-800">
							Your order includes digital products. Download links will be sent to your email address at{" "}
							{order.userEmail}.
						</p>
					</div>
				)}

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
