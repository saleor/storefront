import type { MenuItem } from "@/lib/menus/get-menu-data";
import { getMenuItemHref, getMenuItemLabel, isExternalMenuHref } from "@/lib/menus/menu-item-utils";

export { isExternalMenuHref as isExternalNavHref };

/** Minimal menu tree for client nav — avoids serializing full Saleor MenuItem payloads. */
export type NavMenuItem = {
	id: string;
	label: string;
	href: string | null;
	children?: NavMenuItem[];
};

export function serializeMenuForNav(items: MenuItem[]): NavMenuItem[] {
	return items
		.map((item) => {
			const label = getMenuItemLabel(item);
			if (!label) {
				return null;
			}

			const children = item.children?.length ? serializeMenuForNav(item.children) : undefined;

			return {
				id: item.id,
				label,
				href: getMenuItemHref(item),
				...(children && children.length > 0 ? { children } : {}),
			};
		})
		.filter((item): item is NavMenuItem => item !== null);
}

export function hasNavMenuChildren(item: NavMenuItem): boolean {
	return (item.children?.length ?? 0) > 0;
}
