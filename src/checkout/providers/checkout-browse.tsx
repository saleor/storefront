"use client";

import { createContext, type ReactNode, use, useEffect } from "react";
import { resolveBrowseLocaleSlugWithFallback, writeBrowseLocaleCookieClient } from "@/lib/browse-locale";
import type { LocaleSlug } from "@/config/locale";

const CheckoutBrowseContext = createContext<LocaleSlug | null>(null);

type CheckoutBrowseProviderProps = {
	locale: LocaleSlug;
	children: ReactNode;
};

/** Browse locale from RSC (`browse-locale` cookie / `?locale=`) — stable on SSR and hydration. */
export function CheckoutBrowseProvider({ locale, children }: CheckoutBrowseProviderProps) {
	useEffect(() => {
		writeBrowseLocaleCookieClient(locale);
	}, [locale]);

	return <CheckoutBrowseContext value={locale}>{children}</CheckoutBrowseContext>;
}

export function useCheckoutBrowseLocale(): LocaleSlug {
	const locale = use(CheckoutBrowseContext);
	return locale ?? resolveBrowseLocaleSlugWithFallback();
}
