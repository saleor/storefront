import "server-only";

import { cookies, headers } from "next/headers";
import { cache } from "react";
import { isStorefrontLocaleSlug, type LocaleSlug } from "@/config/locale";
import { BROWSE_LOCALE_COOKIE, resolveBrowseLocaleSlug } from "@/lib/browse-locale";

/** Browse locale from cookie — use on surfaces without `[locale]` in the URL. */
export async function getBrowseLocaleSlug(): Promise<LocaleSlug> {
	const cookieStore = await cookies();
	return resolveBrowseLocaleSlug(cookieStore.get(BROWSE_LOCALE_COOKIE)?.value);
}

function parseCheckoutLocaleFromReferer(referer: string | null): LocaleSlug | null {
	if (!referer) {
		return null;
	}

	try {
		const url = new URL(referer);
		if (!url.pathname.startsWith("/checkout")) {
			return null;
		}

		const locale = url.searchParams.get("locale");
		return locale && isStorefrontLocaleSlug(locale) ? locale : null;
	} catch {
		return null;
	}
}

/**
 * Canonical checkout locale for GraphQL, server actions, and translations.
 * Order: explicit arg → `?locale=` on checkout referer → cookie → default.
 */
export const getCheckoutLocaleSlug = cache(async (explicitLocale?: string | null): Promise<LocaleSlug> => {
	if (explicitLocale && isStorefrontLocaleSlug(explicitLocale)) {
		return explicitLocale;
	}

	const refererLocale = parseCheckoutLocaleFromReferer((await headers()).get("referer"));
	if (refererLocale) {
		return refererLocale;
	}

	return getBrowseLocaleSlug();
});

/**
 * Checkout locale for RSC loaders. Does not write cookies — Next.js 16 only allows
 * `cookies().set()` in Server Actions / Route Handlers; sync happens client-side via
 * `CheckoutBrowseProvider`.
 */
export async function resolveBrowseLocaleForCheckout(urlLocale?: string | null): Promise<LocaleSlug> {
	return getCheckoutLocaleSlug(urlLocale);
}
