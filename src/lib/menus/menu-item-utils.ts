import type { MenuItem } from "@/lib/menus/get-menu-data";

export function getMenuItemLabel(item: MenuItem): string | null {
	if (item.category?.name) return item.category.name;
	if (item.collection?.name) return item.collection.name;
	if (item.page?.title) return item.page.title;
	if (item.name) return item.name;
	return null;
}

export function getMenuItemHref(item: MenuItem): string | null {
	if (item.category?.slug) return `/categories/${item.category.slug}`;
	if (item.collection?.slug) return `/collections/${item.collection.slug}`;
	if (item.page?.slug) return `/pages/${item.page.slug}`;
	if (item.url) return item.url;
	return null;
}

export function getMenuItemChildren(item: MenuItem): MenuItem[] {
	return item.children ?? [];
}

export function hasMenuChildren(item: MenuItem): boolean {
	return getMenuItemChildren(item).length > 0;
}

export function isExternalMenuHref(href: string): boolean {
	return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:");
}
