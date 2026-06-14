import { getDefaultLocaleSlug, isStorefrontLocaleSlug, type LocaleSlug } from "@/config/locale";

type FullMessages = typeof import("../../messages/en.json");

/**
 * Messages shipped to the checkout client — only the namespaces checkout renders.
 * Keeps the locale-less checkout bundle from carrying the whole storefront catalog
 * (PDP/PLP/search/nav/homepage). `account` is included whole because checkout reuses
 * shared auth UI (e.g. `ConfirmAccountMode`) that reads across the namespace.
 */
export type CheckoutMessages = {
	checkout: FullMessages["checkout"];
	account: FullMessages["account"];
};

/** Load the sliced checkout message catalog for a locale (validated against the allowlist). */
export async function loadCheckoutMessages(locale: LocaleSlug): Promise<CheckoutMessages> {
	const safeLocale = isStorefrontLocaleSlug(locale) ? locale : getDefaultLocaleSlug();
	const full = ((await import(`../../messages/${safeLocale}.json`)) as { default: FullMessages }).default;

	return {
		checkout: full.checkout,
		account: full.account,
	};
}
