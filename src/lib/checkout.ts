import { cookies } from "next/headers";
import { checkoutIdCookieName } from "@paper/session-bridge";
import { CheckoutCreateDocument, CheckoutCustomerDetachDocument, CheckoutFindDocument } from "@/gql/graphql";
import { executeAuthenticatedGraphQL, executePublicGraphQL } from "@/lib/graphql";

/** Checkout id from this channel's cart cookie (`checkoutId-{channel}`). */
export async function getIdFromCookies(channel: string) {
	try {
		const cookieName = checkoutIdCookieName(channel);
		const checkoutId = (await cookies()).get(cookieName)?.value || "";
		return checkoutId;
	} catch {
		// During static generation, cookies() throws - return empty string
		return "";
	}
}

/**
 * Cart checkout id when `/checkout` has no `?checkout=` param.
 *
 * Checkout lives at `/checkout` (no `[channel]` segment), but cart cookies are
 * per channel. Returns the first non-empty `checkoutId-*` cookie. If the shopper
 * has carts in multiple channels, which one wins depends on cookie order.
 */
export async function getFirstCheckoutIdFromCartCookies(): Promise<string | null> {
	try {
		for (const cookie of (await cookies()).getAll()) {
			if (cookie.name.startsWith("checkoutId-") && cookie.value) {
				return cookie.value;
			}
		}
	} catch {
		return null;
	}

	return null;
}

export async function saveIdToCookie(channel: string, checkoutId: string) {
	const shouldUseHttps =
		process.env.NEXT_PUBLIC_STOREFRONT_URL?.startsWith("https") || !!process.env.NEXT_PUBLIC_VERCEL_URL;
	const cookieName = checkoutIdCookieName(channel);
	(await cookies()).set(cookieName, checkoutId, {
		sameSite: "lax",
		secure: shouldUseHttps,
	});
}

export async function clearCheckoutCookie(channel: string) {
	const cookieName = checkoutIdCookieName(channel);
	(await cookies()).delete(cookieName);
}

/** Remove any channel cookie that points at a stale checkout ID. */
export async function clearCheckoutCookieByValue(checkoutId: string) {
	if (!checkoutId) {
		return;
	}

	try {
		const cookieStore = await cookies();
		for (const cookie of cookieStore.getAll()) {
			if (cookie.name.startsWith("checkoutId-") && cookie.value === checkoutId) {
				cookieStore.delete(cookie.name);
			}
		}
	} catch {
		// Ignore in static contexts
	}
}

export async function find(checkoutId: string) {
	if (!checkoutId) {
		return null;
	}

	const result = await executePublicGraphQL(CheckoutFindDocument, {
		variables: { id: checkoutId },
		cache: "no-cache",
	});

	return result.ok ? result.data.checkout : null;
}

export async function findOrCreate({ channel, checkoutId }: { checkoutId?: string; channel: string }) {
	if (!checkoutId) {
		const result = await create({ channel });
		return result.ok ? result.data.checkoutCreate?.checkout : null;
	}

	const checkout = await find(checkoutId);
	if (checkout) {
		return checkout;
	}

	const result = await create({ channel });
	return result.ok ? result.data.checkoutCreate?.checkout : null;
}

export const create = ({ channel }: { channel: string }) =>
	executeAuthenticatedGraphQL(CheckoutCreateDocument, { cache: "no-cache", variables: { channel } });

/** Detach the logged-in customer from a checkout (call before sign-out). */
export async function detachCustomer(checkoutId: string) {
	if (!checkoutId) {
		return;
	}

	await executeAuthenticatedGraphQL(CheckoutCustomerDetachDocument, {
		variables: { id: checkoutId },
		cache: "no-cache",
	});
}
