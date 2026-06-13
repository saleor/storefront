import { Suspense } from "react";

import { CheckoutLoadingFallback } from "@/checkout/views/saleor-checkout";
import { formatPageTitle } from "@/config/brand";
import { CheckoutSessionLoader } from "./checkout-session-loader";

export const metadata = {
	title: formatPageTitle("Checkout"),
	description: "Complete your purchase securely.",
};

/**
 * Active checkout route (`/checkout?checkout=`).
 * Order confirmation lives at `/checkout/complete?order=`.
 */
export default function CheckoutPage(props: {
	searchParams: Promise<{ checkout?: string; order?: string; locale?: string }>;
}) {
	return (
		<Suspense fallback={<CheckoutLoadingFallback />}>
			<CheckoutSessionLoader searchParams={props.searchParams} />
		</Suspense>
	);
}
