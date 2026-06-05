import { MenuGetBySlugDocument, type MenuGetBySlugQuery } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import {
	applyCacheProfile,
	FOOTER_MENU_SLUG,
	NAVBAR_MENU_SLUG,
	STOREFRONT_MENU_SLUGS,
	type StorefrontMenuSlug,
} from "@/lib/cache-manifest";

export type MenuItem = NonNullable<NonNullable<NonNullable<MenuGetBySlugQuery["menu"]>["items"]>[number]>;

async function getCachedMenuItems(slug: StorefrontMenuSlug, channel: string): Promise<MenuItem[] | null> {
	"use cache";
	applyCacheProfile(STOREFRONT_MENU_SLUGS[slug], { channel });

	const result = await executePublicGraphQL(MenuGetBySlugDocument, {
		variables: { slug, channel },
	});

	if (!result.ok) {
		console.warn(`[getCachedMenuItems] Failed to fetch menu "${slug}" for ${channel}:`, result.error.message);
		return null;
	}

	return result.data.menu?.items ?? [];
}

export async function getNavbarMenuItems(channel: string) {
	return getCachedMenuItems(NAVBAR_MENU_SLUG, channel);
}

export async function getFooterMenuItems(channel: string) {
	return getCachedMenuItems(FOOTER_MENU_SLUG, channel);
}
