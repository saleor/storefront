import "server-only";

import type { CountryCode } from "@/checkout/graphql";
import { type LocaleSlug, resolveLocaleFromSlug } from "@/config/locale";

const displayNamesByLocale = new Map<string, Intl.DisplayNames>();

function getDisplayNames(localeSlug: LocaleSlug): Intl.DisplayNames {
	const { bcp47 } = resolveLocaleFromSlug(localeSlug);
	const cached = displayNamesByLocale.get(bcp47);
	if (cached) {
		return cached;
	}

	const names = new Intl.DisplayNames([bcp47], { type: "region" });
	displayNamesByLocale.set(bcp47, names);
	return names;
}

/** Region labels for checkout country selects — resolved once on the server for stable SSR/hydration. */
export function formatCountryNameOnServer(countryCode: CountryCode, localeSlug: LocaleSlug): string {
	return getDisplayNames(localeSlug).of(countryCode) ?? countryCode;
}
