"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getStaticStorefrontChannelSlugs } from "@/config/channels";
import { getStorefrontLocaleSlugs } from "@/config/locale";
import { signOutSession } from "@/lib/auth/bff-server";
import { revalidateStorefrontChrome } from "@/lib/auth/revalidate-storefront-chrome";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { CheckoutDeleteLinesDocument, CheckoutLinesUpdateDocument } from "@/gql/graphql";
import * as Checkout from "@/lib/checkout";

function revalidateCart(channel: string) {
	for (const locale of getStorefrontLocaleSlugs()) {
		revalidatePath(buildStorefrontPath(locale, channel, "/cart"));
	}
	revalidateStorefrontChrome(channel);
}

/** Invalidate cached storefront chrome (header + checkout shell). Server actions only — not during RSC render. */
export async function revalidateStorefrontChromeAction(channel: string) {
	revalidateStorefrontChrome(channel);
}

/**
 * SDK `signOut` only clears cookies for the current NEXT_PUBLIC_SALEOR_API_URL.
 * Cookies minted against a previously configured Saleor instance keep matching
 * `hasAuthSession()`'s marker scan, wedging the header in "unavailable" — sweep
 * every Saleor auth cookie regardless of API URL.
 */
async function clearAllSaleorAuthCookies() {
	const cookieStore = await cookies();
	for (const cookie of cookieStore.getAll()) {
		if (cookie.name.includes("saleor_auth")) {
			cookieStore.delete(cookie.name);
		}
	}
}

export async function logout() {
	const cookieStore = await cookies();

	for (const cookie of cookieStore.getAll()) {
		if (!cookie.name.startsWith("checkoutId-") || !cookie.value) {
			continue;
		}
		await Checkout.detachCustomer(cookie.value);
	}

	await signOutSession();
	await clearAllSaleorAuthCookies();

	for (const channel of getStaticStorefrontChannelSlugs()) {
		revalidateStorefrontChrome(channel);
		for (const locale of getStorefrontLocaleSlugs()) {
			revalidatePath(buildStorefrontPath(locale, channel, "/login"));
		}
	}

	revalidatePath("/", "layout");
	revalidatePath("/checkout");
}

export async function saveCheckoutId(channel: string, checkoutId: string) {
	await Checkout.saveIdToCookie(channel, checkoutId);
}

/**
 * Clear the checkout cookie after a successful order.
 * Call after checkoutComplete succeeds — typically after navigating to order confirmation.
 * Never revalidates `/checkout` (that remounts the flow and resets the step mid-payment).
 */
export async function clearCheckout(channel: string) {
	"use server";
	await Checkout.clearCheckoutCookie(channel);
	for (const locale of getStorefrontLocaleSlugs()) {
		revalidatePath(buildStorefrontPath(locale, channel, "/cart"));
	}
	revalidateStorefrontChrome(channel);
}

export async function deleteCartLine(checkoutId: string, lineId: string, channel: string) {
	const result = await executeAuthenticatedGraphQL(CheckoutDeleteLinesDocument, {
		variables: {
			checkoutId,
			lineIds: [lineId],
		},
		cache: "no-cache",
	});

	if (result.ok) {
		const checkout = result.data.checkoutLinesDelete?.checkout;
		if (checkout && checkout.lines.length === 0) {
			await Checkout.clearCheckoutCookie(checkout.channel.slug);
		}
	}

	revalidateCart(channel);
}

export async function updateCartLineQuantity(
	checkoutId: string,
	lineId: string,
	quantity: number,
	channel: string,
) {
	if (quantity < 1) {
		return deleteCartLine(checkoutId, lineId, channel);
	}

	await executeAuthenticatedGraphQL(CheckoutLinesUpdateDocument, {
		variables: {
			checkoutId,
			lines: [{ lineId, quantity }],
		},
		cache: "no-cache",
	});

	revalidateCart(channel);
}
