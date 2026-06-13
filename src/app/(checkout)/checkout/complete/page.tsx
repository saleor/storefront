import { Suspense } from "react";
import { invariant } from "ts-invariant";

import { OrderConfirmationApp } from "@/checkout/order-confirmation-app";
import { fetchCheckoutUserOnServer } from "@/checkout/lib/server/fetch-checkout-user";
import { fetchOrderOnServer } from "@/checkout/lib/server/fetch-order";
import { getBrowseLocaleSlug } from "@/lib/browse-locale-server";
import { OrderConfirmationSkeleton } from "@/checkout/views/order-confirmation";
import { formatPageTitle } from "@/config/brand";

export const metadata = {
	title: formatPageTitle("Order confirmed"),
	description: "Your order has been placed successfully.",
};

/**
 * Order confirmation route (`/checkout/complete?order=`).
 * Separate from active checkout so completion navigation uses a distinct pathname.
 */
export default function OrderCompletePage(props: { searchParams: Promise<{ order?: string }> }) {
	return (
		<Suspense fallback={<OrderConfirmationSkeleton />}>
			<OrderCompleteContent searchParams={props.searchParams} />
		</Suspense>
	);
}

async function OrderCompleteContent({
	searchParams: searchParamsPromise,
}: {
	searchParams: Promise<{ order?: string }>;
}) {
	const searchParams = await searchParamsPromise;
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	const orderId = searchParams.order ?? null;

	const [initialUser, initialOrder, storefrontLocale] = await Promise.all([
		fetchCheckoutUserOnServer(),
		orderId ? fetchOrderOnServer(orderId) : Promise.resolve(null),
		getBrowseLocaleSlug(),
	]);

	return (
		<OrderConfirmationApp
			orderId={orderId}
			initialOrder={initialOrder}
			initialUser={initialUser}
			storefrontLocale={storefrontLocale}
		/>
	);
}
