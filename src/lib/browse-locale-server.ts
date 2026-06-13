import "server-only";

import { cookies } from "next/headers";
import { isStorefrontLocaleSlug, type LocaleSlug } from "@/config/locale";
import { BROWSE_LOCALE_COOKIE, resolveBrowseLocaleSlug } from "@/lib/browse-locale";

/** Browse locale from cookie — use on checkout and other surfaces without `[locale]` in the URL. */
export async function getBrowseLocaleSlug(): Promise<LocaleSlug> {
	const cookieStore = await cookies();
	return resolveBrowseLocaleSlug(cookieStore.get(BROWSE_LOCALE_COOKIE)?.value);
}

/** Checkout locale: `?locale=` from cart handoff wins, then cookie, then default. */
export async function resolveBrowseLocaleForCheckout(urlLocale?: string | null): Promise<LocaleSlug> {
	if (urlLocale && isStorefrontLocaleSlug(urlLocale)) {
		return urlLocale;
	}

	return getBrowseLocaleSlug();
}
