import "server-only";

import { cookies, headers } from "next/headers";
import { cache } from "react";
import { isStorefrontLocaleSlug, type LocaleSlug } from "@/config/locale";
import {
	BROWSE_LOCALE_COOKIE,
	getBrowseLocaleCookieOptions,
	resolveBrowseLocaleSlug,
} from "@/lib/browse-locale";

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

/** Sync browse locale cookie from checkout RSC (middleware skips `/checkout`). */
export async function persistBrowseLocaleCookie(slug: LocaleSlug): Promise<void> {
	const cookieStore = await cookies();
	const current = cookieStore.get(BROWSE_LOCALE_COOKIE)?.value;
	if (current === slug) {
		return;
	}

	cookieStore.set(BROWSE_LOCALE_COOKIE, slug, getBrowseLocaleCookieOptions());
}

/** Checkout locale: `?locale=` from cart handoff wins, then referer, cookie, default. */
export async function resolveBrowseLocaleForCheckout(urlLocale?: string | null): Promise<LocaleSlug> {
	const locale = await getCheckoutLocaleSlug(urlLocale);
	await persistBrowseLocaleCookie(locale);
	return locale;
}
