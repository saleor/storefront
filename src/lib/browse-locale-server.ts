import "server-only";

import { cookies } from "next/headers";
import { type LocaleSlug } from "@/config/locale";
import { BROWSE_LOCALE_COOKIE, resolveBrowseLocaleSlug } from "@/lib/browse-locale";

/** Browse locale from cookie — use on checkout and other surfaces without `[locale]` in the URL. */
export async function getBrowseLocaleSlug(): Promise<LocaleSlug> {
	const cookieStore = await cookies();
	return resolveBrowseLocaleSlug(cookieStore.get(BROWSE_LOCALE_COOKIE)?.value);
}
