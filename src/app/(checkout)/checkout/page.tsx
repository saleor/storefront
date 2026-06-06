import { Suspense } from "react";
import { redirect } from "next/navigation";
import { invariant } from "ts-invariant";
import { buildCheckoutPath } from "@paper/session-bridge";
import { CheckoutApp } from "@/checkout/checkout-app";
import { CheckoutLoadingFallback } from "@/checkout/views/saleor-checkout";
import { fetchCheckoutRoutingOnServer } from "@/checkout/lib/server/fetch-checkout-routing";
import { fetchCheckoutUserOnServer } from "@/checkout/lib/server/fetch-checkout-user";
import { fetchChannelCountriesOnServer } from "@/checkout/lib/server/fetch-channel-countries";
import { fetchOrderOnServer } from "@/checkout/lib/server/fetch-order";
import type { ShippingCountries } from "@/checkout/lib/checkout-types";
import type { CheckoutLoadState } from "@/checkout/providers/checkout-data";
import * as Checkout from "@/lib/checkout";

export const metadata = {
	title: "Checkout · Saleor Storefront example",
	description: "Complete your purchase securely.",
};

/**
 * Checkout route (`/checkout`).
 * Session id comes from `?checkout=` or `?order=`; bare `/checkout` falls back to cart cookies.
 * Per-request via searchParams/cookies — no route segment `dynamic` (incompatible with cacheComponents).
 */
export default function CheckoutPage(props: {
	searchParams: Promise<{ checkout?: string; order?: string }>;
}) {
	return (
		<Suspense fallback={<CheckoutLoadingFallback />}>
			<CheckoutContent searchParams={props.searchParams} />
		</Suspense>
	);
}

async function CheckoutContent({
	searchParams: searchParamsPromise,
}: {
	searchParams: Promise<{ checkout?: string; order?: string }>;
}) {
	const searchParams = await searchParamsPromise;
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	const orderId = searchParams.order ?? null;
	const checkoutIdFromUrl = searchParams.checkout ?? null;

	// Bare `/checkout` (no query): recover session from cart cookie → `/checkout?checkout=…`
	if (!orderId && !checkoutIdFromUrl) {
		const checkoutIdFromCartCookie = await Checkout.getFirstCheckoutIdFromCartCookies();
		if (checkoutIdFromCartCookie) {
			redirect(buildCheckoutPath({ checkoutId: checkoutIdFromCartCookie }));
		}
	}

	const [initialUser, initialOrder] = await Promise.all([
		fetchCheckoutUserOnServer(),
		orderId ? fetchOrderOnServer(orderId) : Promise.resolve(null),
	]);

	let loadState: CheckoutLoadState = "none";
	let channelSlug: string | null = null;
	let shippingCountries: ShippingCountries = [];

	if (orderId) {
		loadState = initialOrder ? "order" : "not_found";
	} else if (!checkoutIdFromUrl) {
		loadState = "none";
	} else {
		// Routing only (empty/not_found/cookie redirect/channel). Full cart loads client-side via syncCheckoutFromServer.
		const checkoutResult = await fetchCheckoutRoutingOnServer(checkoutIdFromUrl);

		if (!checkoutResult.ok) {
			loadState = "error";
		} else if (!checkoutResult.checkout) {
			loadState = "not_found";
			await Checkout.clearCheckoutCookieByValue(checkoutIdFromUrl);
		} else {
			channelSlug = checkoutResult.checkout.channel.slug;
			const checkoutIdFromChannelCookie = await Checkout.getIdFromCookies(channelSlug);

			// Stale or shared `?checkout=` link: channel cookie is the shopper's current cart.
			if (checkoutIdFromChannelCookie && checkoutIdFromChannelCookie !== checkoutIdFromUrl) {
				redirect(buildCheckoutPath({ checkoutId: checkoutIdFromChannelCookie }));
			}

			if (!checkoutResult.checkout.lines.length) {
				loadState = "empty";
			} else {
				loadState = "ready";
			}
		}
	}

	if (channelSlug) {
		shippingCountries = await fetchChannelCountriesOnServer(channelSlug);
	}

	return (
		<CheckoutApp
			checkoutId={checkoutIdFromUrl}
			orderId={orderId}
			loadState={loadState}
			initialOrder={initialOrder}
			initialUser={initialUser}
			shippingCountries={shippingCountries}
		/>
	);
}
