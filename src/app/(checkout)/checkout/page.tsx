import { Suspense } from "react";

import { CheckoutRouteFallback } from "@/checkout/views/saleor-checkout/checkout-route-fallback";
import { formatPageTitle } from "@/config/brand";
import { CheckoutSessionLoader } from "./checkout-session-loader";

/** Checkout is always fresh — skip ahead-of-time segment prefetch. */
export const prefetch = "force-disabled";

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
		<Suspense fallback={<CheckoutRouteFallback />}>
			<CheckoutSessionLoader searchParams={props.searchParams} />
		</Suspense>
	);
}
