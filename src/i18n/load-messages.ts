import { getDefaultLocaleSlug, isStorefrontLocaleSlug, type LocaleSlug } from "@/config/locale";
import { mergeMessagesWithDefault } from "@/i18n/merge-messages";
import enMessages from "../../messages/en.json";

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

async function loadFullMessages(locale: LocaleSlug): Promise<FullMessages> {
	return ((await import(`../../messages/${locale}.json`)) as { default: FullMessages }).default;
}

/** Load the sliced checkout message catalog for a locale (validated against the allowlist). */
export async function loadCheckoutMessages(locale: LocaleSlug): Promise<CheckoutMessages> {
	const safeLocale = isStorefrontLocaleSlug(locale) ? locale : getDefaultLocaleSlug();
	const localeMessages = safeLocale === "en" ? null : await loadFullMessages(safeLocale);

	const merged = localeMessages === null ? enMessages : mergeMessagesWithDefault(enMessages, localeMessages);

	return {
		checkout: merged.checkout,
		account: merged.account,
	};
}
