import { redirect } from "next/navigation";
import { invariant } from "ts-invariant";
import { buildCheckoutPath, buildOrderConfirmationPath } from "@paper/session-bridge";
import { DefaultChannelSlug } from "@/app/config";
import { CheckoutApp } from "@/checkout/checkout-app";
import { getStorefrontContent } from "@/lib/content/server";
import type { CheckoutLoadState, ServerCheckout, ShippingCountries } from "@/checkout/lib/checkout-types";
import {
	getCheckoutSessionCheckout,
	getCheckoutSessionCountries,
	getCheckoutSessionUser,
} from "@/checkout/lib/server/get-checkout-session-data";
import * as Checkout from "@/lib/checkout";

/** Server-visible checkout URL params. `step` is client-only (shallow `?step=` updates). */
export type CheckoutPageSearchParams = {
	checkout?: string;
	order?: string;
};

type CheckoutSessionLoaderProps = {
	searchParams: Promise<CheckoutPageSearchParams>;
};

/**
 * RSC entry for active checkout — loads session data from `?checkout=` only.
 * Step UI (`?step=`) is resolved client-side via `useCheckoutStepFromUrl`.
 */
export async function CheckoutSessionLoader({
	searchParams: searchParamsPromise,
}: CheckoutSessionLoaderProps) {
	const searchParams = await searchParamsPromise;
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	const orderId = searchParams.order ?? null;
	const checkoutIdFromUrl = searchParams.checkout ?? null;

	if (orderId) {
		redirect(buildOrderConfirmationPath({ orderId }));
	}

	if (!checkoutIdFromUrl) {
		const checkoutIdFromCartCookie = await Checkout.getFirstCheckoutIdFromCartCookies();
		if (checkoutIdFromCartCookie) {
			redirect(buildCheckoutPath({ checkoutId: checkoutIdFromCartCookie }));
		}
	}

	const [initialUser, checkoutResult] = await Promise.all([
		getCheckoutSessionUser(),
		checkoutIdFromUrl ? getCheckoutSessionCheckout(checkoutIdFromUrl) : Promise.resolve(null),
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
		shippingCountries = await getCheckoutSessionCountries(channelSlug);
	}

	const browseChannel = channelSlug ?? (await Checkout.getChannelSlugFromCartCookies());
	const contentChannel = browseChannel ?? DefaultChannelSlug ?? "default-channel";
	const checkoutContent = (await getStorefrontContent(contentChannel)).surfaces.checkout;

	return (
		<CheckoutApp
			checkoutId={checkoutIdFromUrl}
			loadState={loadState}
			initialCheckout={initialCheckout}
			initialUser={initialUser}
			shippingCountries={shippingCountries}
			checkoutContent={checkoutContent}
		/>
	);
}
