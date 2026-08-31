"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { signOutSession } from "@/lib/auth/bff-server";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { CheckoutDeleteLinesDocument, CheckoutLinesUpdateDocument } from "@/gql/graphql";
import * as Checkout from "@/lib/checkout";

// Private state (session/cart cookies) lives in dynamic holes that read cookies at
// request time — it is never in the shared cache, so there is nothing global to
// invalidate. `refresh()` re-renders the acting user's route in the action response;
// `revalidatePath` here would purge shared static shells for every visitor (a
// sitewide regeneration bill per cart click). Cross-tab sync is client-side via
// `bumpChromeVersion()` — see src/lib/chrome-sync.ts and the `paper-vercel-cost` rule.

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

/** Callers hard-navigate afterwards (see `useLogout`), which picks up the cleared cookies. */
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
	refresh();
}

export async function deleteCartLine(checkoutId: string, lineId: string) {
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

	refresh();
}

export async function updateCartLineQuantity(checkoutId: string, lineId: string, quantity: number) {
	if (quantity < 1) {
		return deleteCartLine(checkoutId, lineId);
	}

	await executeAuthenticatedGraphQL(CheckoutLinesUpdateDocument, {
		variables: {
			checkoutId,
			lines: [{ lineId, quantity }],
		},
		cache: "no-cache",
	});

	refresh();
}
