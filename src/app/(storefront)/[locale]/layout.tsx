import { type ReactNode } from "react";
import { notFound } from "next/navigation";
import { getStorefrontLocaleSlugs, isStorefrontLocaleSlug } from "@/config/locale";

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

	return children;
}
