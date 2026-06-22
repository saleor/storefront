import { getRequestConfig } from "next-intl/server";
import { getDefaultLocaleSlug, isStorefrontLocaleSlug, type LocaleSlug } from "@/config/locale";
import { mergeMessagesWithDefault } from "@/i18n/merge-messages";

async function loadMessagesForLocale(locale: LocaleSlug): Promise<Record<string, unknown>> {
	const defaultLocale = getDefaultLocaleSlug();
	const defaultMessages = (
		(await import(`../../messages/${defaultLocale}.json`)) as { default: Record<string, unknown> }
	).default;

	if (locale === defaultLocale) {
		return defaultMessages;
	}

	const localizedMessages = (
		(await import(`../../messages/${locale}.json`)) as { default: Record<string, unknown> }
	).default;

	return mergeMessagesWithDefault(defaultMessages, localizedMessages);
}

/**
 * next-intl request config for code-owned UI/functional strings.
 *
 * next-intl does NOT own routing here — the URL `[locale]` segment is authoritative
 * (ADR 0001/0002). Callers pass the locale explicitly (`getTranslations({ locale })`,
 * `<NextIntlClientProvider locale={…}>`), which next-intl forwards as `requestLocale`.
 * We only validate it against the storefront allowlist and fall back to the default.
 */
export default getRequestConfig(async ({ requestLocale }) => {
	const requested = await requestLocale;
	const locale = requested && isStorefrontLocaleSlug(requested) ? requested : getDefaultLocaleSlug();

	return {
		locale,
		messages: await loadMessagesForLocale(locale),
	};
});
