"use client";

import { useEffect } from "react";
import { isStorefrontLocaleSlug, type LocaleSlug } from "@/config/locale";
import { writeBrowseLocaleCookieClient } from "@/lib/browse-locale";

/** Sync `browse-locale` cookie from the URL segment (RSC cannot call `cookies().set()`). */
export function PersistBrowseLocaleCookie({ locale }: { locale: LocaleSlug }) {
	useEffect(() => {
		if (isStorefrontLocaleSlug(locale)) {
			writeBrowseLocaleCookieClient(locale);
		}
	}, [locale]);

	return null;
}
