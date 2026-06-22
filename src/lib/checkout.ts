import { cookies } from "next/headers";
import { checkoutIdCookieName } from "@paper/session-bridge";
import { CheckoutCreateDocument, CheckoutCustomerDetachDocument, CheckoutFindDocument } from "@/gql/graphql";
import { type CartCheckout, withTranslatedCartCheckout } from "@/lib/cart-checkout";
import { checkoutGraphqlLocaleVariables } from "@/lib/checkout-locale";
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
 * per channel. With carts in multiple channels the default channel wins;
 * otherwise channels are compared alphabetically so the pick is deterministic.
 */
/** Channel slug from cart cookies when checkout channel is not yet known (e.g. empty checkout). */
export async function getChannelSlugFromCartCookies(): Promise<string | null> {
	try {
		const cartCookies = (await cookies())
			.getAll()
			.filter((cookie) => cookie.name.startsWith("checkoutId-") && cookie.value);

		if (cartCookies.length === 0) {
			return null;
		}

		const channelFromCookie = (name: string) => name.slice(checkoutIdCookieName("").length);

		const defaultChannel = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL;
		if (defaultChannel) {
			const preferred = cartCookies.find((cookie) => cookie.name === checkoutIdCookieName(defaultChannel));
			if (preferred) {
				return channelFromCookie(preferred.name);
			}
		}

		return channelFromCookie([...cartCookies].sort((a, b) => a.name.localeCompare(b.name))[0].name);
	} catch {
		return null;
	}
}

export async function getFirstCheckoutIdFromCartCookies(): Promise<string | null> {
	try {
		const cartCookies = (await cookies())
			.getAll()
			.filter((cookie) => cookie.name.startsWith("checkoutId-") && cookie.value);

		if (cartCookies.length === 0) {
			return null;
		}

		const defaultChannel = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL;
		if (defaultChannel) {
			const preferred = cartCookies.find((cookie) => cookie.name === checkoutIdCookieName(defaultChannel));
			if (preferred) {
				return preferred.value;
			}
		}

		return [...cartCookies].sort((a, b) => a.name.localeCompare(b.name))[0].value;
	} catch {
		return null;
	}
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

export async function find(checkoutId: string, localeSlug?: string): Promise<CartCheckout | null> {
	if (!checkoutId) {
		return null;
	}

	const result = await executePublicGraphQL(CheckoutFindDocument, {
		variables: { id: checkoutId, ...(await checkoutGraphqlLocaleVariables(localeSlug)) },
		cache: "no-cache",
	});

	if (!result.ok || !result.data.checkout) {
		return null;
	}

	return withTranslatedCartCheckout(result.data.checkout);
}

export async function findOrCreate({
	channel,
	checkoutId,
	localeSlug,
}: {
	checkoutId?: string;
	channel: string;
	localeSlug?: string;
}) {
	if (!checkoutId) {
		const result = await create({ channel, localeSlug });
		return result.ok ? result.data.checkoutCreate?.checkout : null;
	}

	const checkout = await find(checkoutId, localeSlug);
	if (checkout) {
		return checkout;
	}

	const result = await create({ channel, localeSlug });
	return result.ok ? result.data.checkoutCreate?.checkout : null;
}

export async function create({ channel, localeSlug }: { channel: string; localeSlug?: string }) {
	return executeAuthenticatedGraphQL(CheckoutCreateDocument, {
		cache: "no-cache",
		variables: { channel, ...(await checkoutGraphqlLocaleVariables(localeSlug)) },
	});
}

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
