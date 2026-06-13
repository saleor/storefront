import "server-only";

import { isStorefrontLocaleSlug, type LocaleSlug } from "@/config/locale";
import { getBrowseLocaleSlug } from "@/lib/browse-locale-server";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import type { LanguageCodeEnum } from "@/gql/graphql";

/** Browse locale for cart/checkout GraphQL — URL slug on storefront, cookie on `/checkout`. */
export async function resolveCheckoutLocaleSlug(localeSlug?: string): Promise<LocaleSlug> {
	if (localeSlug && isStorefrontLocaleSlug(localeSlug)) {
		return localeSlug;
	}
	return getBrowseLocaleSlug();
}

export async function checkoutGraphqlLanguageCode(localeSlug?: string): Promise<LanguageCodeEnum> {
	const locale = await resolveCheckoutLocaleSlug(localeSlug);
	return graphqlLanguageCodeVariables(locale).languageCode;
}

export async function checkoutGraphqlLocaleVariables(localeSlug?: string) {
	const locale = await resolveCheckoutLocaleSlug(localeSlug);
	return graphqlLanguageCodeVariables(locale);
}
