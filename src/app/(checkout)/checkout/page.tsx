import { Suspense } from "react";
import { redirect } from "next/navigation";
import { invariant } from "ts-invariant";
import { buildCheckoutPath, buildOrderConfirmationPath } from "@paper/session-bridge";
import { CheckoutApp } from "@/checkout/checkout-app";
import { CheckoutLoadingFallback } from "@/checkout/views/saleor-checkout";
import { fetchCheckoutUserOnServer } from "@/checkout/lib/server/fetch-checkout-user";
import { fetchChannelCountriesOnServer } from "@/checkout/lib/server/fetch-channel-countries";
import { fetchCheckoutOnServer } from "@/checkout/lib/server/fetch-checkout";
import type { CheckoutLoadState, ServerCheckout, ShippingCountries } from "@/checkout/lib/checkout-types";
import * as Checkout from "@/lib/checkout";

export const metadata = {
	title: "Checkout · Saleor Storefront example",
	description: "Complete your purchase securely.",
};

/**
 * Active checkout route (`/checkout?checkout=`).
 * Order confirmation lives at `/checkout/complete?order=`.
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

	if (orderId) {
		redirect(buildOrderConfirmationPath({ orderId }));
	}

	// Bare `/checkout` (no query): recover session from cart cookie → `/checkout?checkout=…`
	if (!checkoutIdFromUrl) {
		const checkoutIdFromCartCookie = await Checkout.getFirstCheckoutIdFromCartCookies();
		if (checkoutIdFromCartCookie) {
			redirect(buildCheckoutPath({ checkoutId: checkoutIdFromCartCookie }));
		}
	}

	const [initialUser, checkoutResult] = await Promise.all([
		fetchCheckoutUserOnServer(),
		checkoutIdFromUrl ? fetchCheckoutOnServer(checkoutIdFromUrl) : Promise.resolve(null),
	]);

	let loadState: CheckoutLoadState = "none";
	let channelSlug: string | null = null;
	let initialCheckout: ServerCheckout | null = null;
	let shippingCountries: ShippingCountries = [];

	if (!checkoutIdFromUrl) {
		loadState = "none";
	} else if (!checkoutResult) {
		loadState = "error";
	} else if (!checkoutResult.ok) {
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
			initialCheckout = checkoutResult.checkout;
		}
	}

	if (channelSlug) {
		shippingCountries = await fetchChannelCountriesOnServer(channelSlug);
	}

	return (
		<CheckoutApp
			checkoutId={checkoutIdFromUrl}
			loadState={loadState}
			initialCheckout={initialCheckout}
			initialUser={initialUser}
			shippingCountries={shippingCountries}
		/>
	);
}
