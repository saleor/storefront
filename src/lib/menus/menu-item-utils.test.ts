import { describe, expect, it } from "vitest";
import {
	getMenuItemChildren,
	getMenuItemHref,
	getMenuItemLabel,
	hasMenuChildren,
	isExternalMenuHref,
} from "./menu-item-utils";
import type { MenuItem } from "./get-menu-data";

const baseItem = {
	id: "1",
	name: "Custom link",
	level: 0,
	category: null,
	collection: null,
	page: null,
	url: null,
	children: null,
} satisfies MenuItem;

describe("menu-item-utils", () => {
	it("resolves category href and label", () => {
		const item: MenuItem = {
			...baseItem,
			category: { id: "c1", slug: "apparel", name: "Apparel" },
		};

		expect(getMenuItemLabel(item)).toBe("Apparel");
		expect(getMenuItemHref(item)).toBe("/categories/apparel");
	});

	it("resolves collection and page links", () => {
		expect(
			getMenuItemHref({
				...baseItem,
				collection: { id: "col1", slug: "summer", name: "Summer" },
			}),
		).toBe("/collections/summer");

		expect(
			getMenuItemHref({
				...baseItem,
				page: { id: "p1", slug: "about", title: "About us" },
			}),
		).toBe("/pages/about");
	});

	it("detects safe external urls", () => {
		expect(isExternalMenuHref("https://saleor.io")).toBe(true);
		expect(isExternalMenuHref("mailto:hello@example.com")).toBe(true);
		expect(isExternalMenuHref("/products")).toBe(false);
		expect(isExternalMenuHref("javascript:alert(1)")).toBe(false);
	});

	it("drops unsafe custom menu URLs", () => {
		expect(
			getMenuItemHref({
				...baseItem,
				url: "javascript:alert(1)",
			}),
		).toBeNull();
	});

	it("reads nested children", () => {
		const child = { ...baseItem, id: "2", name: "Child" };
		const item: MenuItem = { ...baseItem, children: [child] };

		expect(hasMenuChildren(item)).toBe(true);
		expect(getMenuItemChildren(item)).toHaveLength(1);
	});
});
