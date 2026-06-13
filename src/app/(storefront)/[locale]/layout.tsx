import { type ReactNode } from "react";
import { notFound } from "next/navigation";
import { getStorefrontLocaleSlugs, isStorefrontLocaleSlug, resolveLocaleFromSlug } from "@/config/locale";
import { DocumentLang } from "@/ui/components/document-lang";

export function generateStaticParams() {
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
