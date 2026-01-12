"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SaleorCheckout, CheckoutSkeleton } from "@/checkout/views/SaleorCheckout";
import { OrderConfirmation, OrderConfirmationSkeleton } from "@/checkout/views/OrderConfirmation";
import { getQueryParams } from "@/checkout/lib/utils/url";

export const RootViews = () => {
	const searchParams = useSearchParams();
	const orderId = getQueryParams(searchParams).orderId;

	if (orderId) {
		return (
			<Suspense fallback={<OrderConfirmationSkeleton />}>
				<OrderConfirmation />
			</Suspense>
		);
	}

	return (
		<Suspense fallback={<CheckoutSkeleton />}>
			<SaleorCheckout />
		</Suspense>
	);
};
