import { describe, expect, it } from "vitest";
import { hasNavMenuChildren, serializeMenuForNav } from "./serialize-menu-for-nav";
import type { MenuItem } from "./get-menu-data";

const baseItem = {
	id: "1",
	name: "Shop",
	level: 0,
	category: null,
	collection: null,
	page: null,
	url: null,
	children: null,
} satisfies MenuItem;

describe("serializeMenuForNav", () => {
	it("maps nested items to minimal nav tree", () => {
		const items: MenuItem[] = [
			{
				...baseItem,
				category: { id: "c1", slug: "apparel", name: "Apparel" },
				children: [
					{
						...baseItem,
						id: "2",
						category: { id: "c2", slug: "shirts", name: "Shirts" },
						children: [
							{
								...baseItem,
								id: "3",
								collection: { id: "col1", slug: "tees", name: "Tees" },
							},
						],
					},
				],
			},
		];

		const nav = serializeMenuForNav(items);

		expect(nav).toHaveLength(1);
		expect(nav[0]?.label).toBe("Apparel");
		expect(nav[0]?.href).toBe("/categories/apparel");
		expect(nav[0]?.children?.[0]?.label).toBe("Shirts");
		expect(nav[0]?.children?.[0]?.children?.[0]?.href).toBe("/collections/tees");
		expect(hasNavMenuChildren(nav[0]!)).toBe(true);
	});

	it("drops items without a resolvable label", () => {
		expect(serializeMenuForNav([{ ...baseItem, name: "" }])).toHaveLength(0);
	});
});
