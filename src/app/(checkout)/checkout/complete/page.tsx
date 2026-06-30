import { Suspense } from "react";
import { invariant } from "ts-invariant";

import { OrderConfirmationApp } from "@/checkout/order-confirmation-app";
import { fetchCheckoutUserOnServer } from "@/checkout/lib/server/fetch-checkout-user";
import { fetchOrderOnServer } from "@/checkout/lib/server/fetch-order";
import { resolveBrowseLocaleForCheckout } from "@/lib/browse-locale-server";
import { loadCheckoutMessages } from "@/i18n/load-messages";
import { OrderConfirmationRouteFallback } from "@/checkout/views/order-confirmation/order-confirmation-route-fallback";
import { formatPageTitle } from "@/config/brand";

/** One-time post-purchase surface — no browse prefetch. */
export const prefetch = "force-disabled";

export const metadata = {
	title: formatPageTitle("Order confirmed"),
	description: "Your order has been placed successfully.",
};

/**
 * Order confirmation route (`/checkout/complete?order=`).
 * Separate from active checkout so completion navigation uses a distinct pathname.
 */
export default function OrderCompletePage(props: {
	searchParams: Promise<{ order?: string; locale?: string }>;
}) {
	return (
		<Suspense fallback={<OrderConfirmationRouteFallback />}>
			<OrderCompleteContent searchParams={props.searchParams} />
		</Suspense>
	);
}

async function OrderCompleteContent({
	searchParams: searchParamsPromise,
}: {
	searchParams: Promise<{ order?: string; locale?: string }>;
}) {
	const searchParams = await searchParamsPromise;
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	const orderId = searchParams.order ?? null;
	const storefrontLocale = await resolveBrowseLocaleForCheckout(searchParams.locale);

	const [initialUser, initialOrder, messages] = await Promise.all([
		fetchCheckoutUserOnServer(),
		orderId ? fetchOrderOnServer(orderId, storefrontLocale) : Promise.resolve(null),
		loadCheckoutMessages(storefrontLocale),
	]);

	return (
		<OrderConfirmationApp
			orderId={orderId}
			initialOrder={initialOrder}
			initialUser={initialUser}
			storefrontLocale={storefrontLocale}
			messages={messages}
		/>
	);
}
