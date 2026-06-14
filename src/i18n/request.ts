import { getRequestConfig } from "next-intl/server";
import { getDefaultLocaleSlug, isStorefrontLocaleSlug } from "@/config/locale";

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
		messages: ((await import(`../../messages/${locale}.json`)) as { default: Record<string, unknown> })
			.default,
	};
});
