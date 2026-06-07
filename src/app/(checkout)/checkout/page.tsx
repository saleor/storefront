import { Suspense } from "react";

import { CheckoutLoadingFallback } from "@/checkout/views/saleor-checkout";
import { CheckoutSessionLoader } from "./checkout-session-loader";

export const metadata = {
	title: "Checkout · Saleor Storefront example",
	description: "Complete your purchase securely.",
};

/**
 * Active checkout route (`/checkout?checkout=`).
 * Order confirmation lives at `/checkout/complete?order=`.
 */
export default function CheckoutPage(props: {
	searchParams: Promise<{ checkout?: string; order?: string }>;
}) {
	return (
		<Suspense fallback={<CheckoutLoadingFallback />}>
			<CheckoutSessionLoader searchParams={props.searchParams} />
		</Suspense>
	);
}
