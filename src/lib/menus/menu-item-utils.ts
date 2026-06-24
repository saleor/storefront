import type { MenuItem } from "@/lib/menus/get-menu-data";
import { pickTranslatedName, pickTranslatedTitle } from "@/lib/saleor-translations";
import { isSafeExternalHref, isSafeMailtoHref, sanitizeNavHref } from "@/lib/url/safe-href";

export function getMenuItemLabel(item: MenuItem): string | null {
	if (item.category?.name) return pickTranslatedName(item.category);
	if (item.collection?.name) return pickTranslatedName(item.collection);
	if (item.page?.title) return pickTranslatedTitle(item.page);
	if (item.name) return pickTranslatedName(item);
	return null;
}

export function getMenuItemHref(item: MenuItem): string | null {
	if (item.category?.slug) return `/categories/${item.category.slug}`;
	if (item.collection?.slug) return `/collections/${item.collection.slug}`;
	if (item.page?.slug) return `/pages/${item.page.slug}`;
	if (item.url) return sanitizeNavHref(item.url);
	return null;
}

export function getMenuItemChildren(item: MenuItem): MenuItem[] {
	return item.children ?? [];
}

export function hasMenuChildren(item: MenuItem): boolean {
	return getMenuItemChildren(item).length > 0;
}

export function isExternalMenuHref(href: string): boolean {
	return isSafeExternalHref(href) || isSafeMailtoHref(href);
}
