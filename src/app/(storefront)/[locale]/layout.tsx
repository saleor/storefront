import { type ReactNode } from "react";
import { notFound } from "next/navigation";
import { getConfiguredLocaleChannelPairs } from "@/config/locale-channel";
import { getStorefrontLocaleSlugs, isStorefrontLocaleSlug, resolveLocaleFromSlug } from "@/config/locale";
import { DocumentLang } from "@/ui/components/document-lang";

export function generateStaticParams() {
	const pairs = getConfiguredLocaleChannelPairs();
	if (pairs) {
		const locales = [...new Set(pairs.map((pair) => pair.locale))];
		return locales.map((locale) => ({ locale }));
	}

	return getStorefrontLocaleSlugs().map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	if (!isStorefrontLocaleSlug(locale)) {
		notFound();
	}

	const htmlLang = resolveLocaleFromSlug(locale).htmlLang;

	return (
		<>
			<DocumentLang lang={htmlLang} />
			{children}
		</>
	);
}
