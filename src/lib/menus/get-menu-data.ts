import "server-only";

import { MenuGetBySlugDocument, type MenuGetBySlugQuery } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import {
	cachedQuery,
	FOOTER_MENU_SLUG,
	NAVBAR_MENU_SLUG,
	STOREFRONT_MENU_SLUGS,
	type StorefrontMenuSlug,
} from "@/lib/saleor";

export type MenuItem = NonNullable<NonNullable<NonNullable<MenuGetBySlugQuery["menu"]>["items"]>[number]>;

async function getCachedMenuItems(
	slug: StorefrontMenuSlug,
	channel: string,
	localeSlug: string,
): Promise<MenuItem[] | null> {
	"use cache";

	const data = await cachedQuery(MenuGetBySlugDocument, {
		profile: STOREFRONT_MENU_SLUGS[slug],
		tag: { channel },
		variables: { slug, channel, ...graphqlLanguageCodeVariables(localeSlug) },
	});

	return data.menu?.items ?? [];
}

export async function getNavbarMenuItems(channel: string, localeSlug: string) {
	return getCachedMenuItems(NAVBAR_MENU_SLUG, channel, localeSlug);
}

export async function getFooterMenuItems(channel: string, localeSlug: string) {
	return getCachedMenuItems(FOOTER_MENU_SLUG, channel, localeSlug);
}
