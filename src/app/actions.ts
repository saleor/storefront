"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { signOutSession } from "@/lib/auth/bff-server";
import { mutate } from "@/lib/saleor";
import {
	BuyAgainAddLinesDocument,
	CheckoutAddLineDocument,
	CheckoutDeleteLinesDocument,
	CheckoutLinesUpdateDocument,
} from "@/gql/graphql";
import { emitCommerceEvent } from "@/lib/analytics/emit.server";
import * as Checkout from "@/lib/checkout";
import { getStorefrontChannelSlugs } from "@/lib/channel-slugs";
import { availableQuantity, getRepeatVariants } from "@/lib/custom/get-buy-again";
import { planRepeatOrder, type RepeatLine } from "@/lib/custom/buy-again";

export type BuyAgainResult =
	| { ok: true; added: number; skipped: number }
	| { ok: false; error: "invalid" | "unavailable" | "changed" | "uncertain" };

export async function buyAgain(input: {
	channel: string;
	localeSlug: string;
	lines: RepeatLine[];
}): Promise<BuyAgainResult> {
	if (
		!input ||
		!Array.isArray(input.lines) ||
		input.lines.length === 0 ||
		input.lines.length > 100 ||
		input.lines.some(
			(line) =>
				!line ||
				!Number.isInteger(line.quantity) ||
				line.quantity < 1 ||
				line.quantity > 999 ||
				(line.variantId !== null && (typeof line.variantId !== "string" || line.variantId.length > 200)),
		) ||
		!(await getStorefrontChannelSlugs()).includes(input.channel)
	) {
		return { ok: false, error: "invalid" };
	}

	const variants = await getRepeatVariants(input.channel, [
		...new Set(input.lines.flatMap((line) => (line.variantId ? [line.variantId] : []))),
	]);
	const stock = new Map(variants.map((variant) => [variant.id, availableQuantity(variant)]));
	if (!planRepeatOrder(input.lines, stock, new Map()).added) return { ok: false, error: "unavailable" };

	const checkout = await Checkout.findOrCreate({
		checkoutId: await Checkout.getIdFromCookies(input.channel),
		channel: input.channel,
		localeSlug: input.localeSlug,
	});
	if (!checkout) return { ok: false, error: "uncertain" };
	const existing = new Map<string, number>();
	for (const line of checkout.lines) {
		existing.set(line.variant.id, (existing.get(line.variant.id) ?? 0) + line.quantity);
	}
	const plan = planRepeatOrder(input.lines, stock, existing);
	if (!plan.added) return { ok: false, error: "unavailable" };
	// Save before the mutation so even an ambiguous network failure leaves the cart recoverable.
	await Checkout.saveIdToCookie(input.channel, checkout.id);
	const result = await mutate(BuyAgainAddLinesDocument, {
		variables: { id: checkout.id, lines: plan.lines },
	});
	refresh();
	if (!result.ok || result.partialErrors?.length) return { ok: false, error: "uncertain" };
	if (result.data.checkoutLinesAdd?.errors.length) return { ok: false, error: "changed" };
	if (!result.data.checkoutLinesAdd?.checkout) return { ok: false, error: "uncertain" };
	emitCommerceEvent({
		name: "product_added_to_cart",
		channel: input.channel,
		value: plan.lines.reduce(
			(sum, line) =>
				sum +
				line.quantity * (variants.find((v) => v.id === line.variantId)?.pricing?.price?.gross.amount ?? 0),
			0,
		),
		currency: variants[0]?.pricing?.price?.gross.currency ?? "",
	});
	return { ok: true, added: plan.added, skipped: plan.skipped };
}

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
	const result = await mutate(CheckoutDeleteLinesDocument, {
		variables: {
			checkoutId,
			lineIds: [lineId],
		},
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

	await mutate(CheckoutLinesUpdateDocument, {
		variables: {
			checkoutId,
			lines: [{ lineId, quantity }],
		},
	});

	refresh();
}

/** Add a variant to the channel cart. Private refresh only — never busts the shared cache. */
export async function addVariantToCart(input: {
	channel: string;
	localeSlug: string;
	variantId: string;
	value?: number;
	currency?: string;
}) {
	const checkout = await Checkout.findOrCreate({
		checkoutId: await Checkout.getIdFromCookies(input.channel),
		channel: input.channel,
		localeSlug: input.localeSlug,
	});

	if (!checkout) {
		console.error("Add to cart: Failed to create checkout");
		return;
	}

	await Checkout.saveIdToCookie(input.channel, checkout.id);

	const addResult = await mutate(CheckoutAddLineDocument, {
		variables: {
			id: checkout.id,
			productVariantId: decodeURIComponent(input.variantId),
		},
	});

	if (!addResult.ok) {
		console.error("Add to cart failed:", addResult.error.message);
		return;
	}

	if (addResult.data.checkoutLinesAdd?.errors?.length) {
		console.error("Add to cart failed:", addResult.data.checkoutLinesAdd.errors);
		return;
	}

	emitCommerceEvent({
		name: "product_added_to_cart",
		channel: input.channel,
		value: input.value ?? 0,
		currency: input.currency ?? "",
	});

	refresh();
}
