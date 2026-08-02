import "../../globals.css";
import { type ReactNode } from "react";
import { type Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { rootMetadata } from "@/lib/seo";
import { getConfiguredLocaleChannelPairs } from "@/config/locale-channel";
import {
	getDefaultLocaleSlug,
	getStorefrontLocaleSlugs,
	isStorefrontLocaleSlug,
	resolveLocaleFromSlug,
} from "@/config/locale";
import { PersistBrowseLocaleCookie } from "@/ui/components/persist-browse-locale-cookie";
import { getRootHtmlFontProps } from "@/lib/fonts";

/**
 * Root defaults + `og:locale` derived from the URL locale segment. Params-only, so it
 * stays static under PPR. Browse pages that build their own OpenGraph block
 * (`buildBrowsePageMetadata`) replace this wholesale; everything else (login, account,
 * cart, …) inherits a locale-correct default instead of a hardcoded `en_US`.
 */
export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const definition = resolveLocaleFromSlug(isStorefrontLocaleSlug(locale) ? locale : getDefaultLocaleSlug());

	if (!rootMetadata.openGraph) return rootMetadata;
	return {
		...rootMetadata,
		openGraph: { ...rootMetadata.openGraph, locale: definition.ogLocale },
	};
}

export function generateStaticParams() {
	const pairs = getConfiguredLocaleChannelPairs();
	if (pairs) {
		const locales = [...new Set(pairs.map((pair) => pair.locale))];
		return locales.map((locale) => ({ locale }));
	}

	return getStorefrontLocaleSlugs().map((locale) => ({ locale }));
}

/**
 * Storefront root layout — renders `<html lang>` server-side from the URL locale segment.
 *
 * Invalid locale slugs fall back to the default `htmlLang` here so the not-found boundary
 * still has an HTML shell; the actual `notFound()` for invalid pairs lives in `[channel]/layout`.
 */
export default async function LocaleRootLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const localeSlug = isStorefrontLocaleSlug(locale) ? locale : getDefaultLocaleSlug();
	const htmlLang = resolveLocaleFromSlug(localeSlug).htmlLang;

	// Code-owned UI strings (next-intl). Locale comes from the URL segment (ADR 0001/0002),
	// not next-intl routing. `setRequestLocale` seeds the request config from our param so
	// message resolution stays static (no `headers()`) — preserves PPR / Cache Components.
	setRequestLocale(localeSlug);
	const messages = await getMessages();
	const htmlProps = getRootHtmlFontProps(htmlLang);

	return (
		<html {...htmlProps}>
			<body className="min-h-dvh font-sans">
				<NextIntlClientProvider locale={localeSlug} messages={messages}>
					<PersistBrowseLocaleCookie locale={localeSlug} />
					{children}
					<SpeedInsights />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
