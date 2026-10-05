import type { ListingQuery, ListingResult, ProductCardView, SortId } from "@/lib/storefront/contract/listing";
import { listingQueryWithSupportedSort, type ListingProvider } from "@/lib/listing/provider";

const LISTING_SORTS = [
	"featured",
	"newest",
	"price_asc",
	"price_desc",
	"bestselling",
] as const satisfies readonly SortId[];
const SEARCH_SORTS = [
	"relevance",
	"newest",
	"price_asc",
	"price_desc",
	"name",
] as const satisfies readonly SortId[];

type FixtureItem = {
	card: ProductCardView;
	category: string;
	collections: string[];
	text: string;
};

function card(index: number, color: "blue" | "red", size: "m" | "l", price: number): FixtureItem {
	const slug = `hoodie-${index}`;
	return {
		category: "hoodies",
		collections: index < 3 ? ["summer"] : [],
		text: `hoodie ${color} ${size}`,
		card: {
			id: `fixture-${index}`,
			name: `Hoodie ${index}`,
			slug,
			price,
			currency: "USD",
			image: "/placeholder.svg",
			href: `/products/${slug}`,
			colors: [{ name: color, slug: color, hex: color === "blue" ? "#1d4ed8" : "#b91c1c" }],
			sizes: [{ name: size.toUpperCase(), slug: size }],
			category: { id: "cat-hoodies", name: "Hoodies", slug: "hoodies" },
			createdAt: new Date(Date.UTC(2024, 0, index + 1)).toISOString(),
		},
	};
}

const ITEMS: FixtureItem[] = [
	...Array.from({ length: 10 }, (_, index) => card(index, "blue", "m", 40 + index)),
	...Array.from({ length: 5 }, (_, index) => card(index + 10, "red", "l", 80 + index)),
];

function inSurface(item: FixtureItem, query: ListingQuery): boolean {
	switch (query.surface.kind) {
		case "all":
			return true;
		case "category":
			return item.category === query.surface.slug;
		case "collection":
			return item.collections.includes(query.surface.slug);
		case "search": {
			const text = query.surface.text.toLowerCase();
			return item.text.includes(text) || item.card.name.toLowerCase().includes(text);
		}
	}
}

function matchesRange(item: FixtureItem, query: ListingQuery): boolean {
	const price = query.range?.price;
	if (!price) return true;
	if (price.min != null && item.card.price < price.min) return false;
	if (price.max != null && item.card.price > price.max) return false;
	return true;
}

function matchesSelection(item: FixtureItem, query: ListingQuery, skip?: string): boolean {
	for (const [id, values] of Object.entries(query.selections)) {
		if (values.length === 0 || id === skip) continue;
		if (id === "colors" && !item.card.colors?.some((color) => values.includes(color.slug))) return false;
		if (id === "sizes" && !item.card.sizes?.some((size) => values.includes(size.slug))) return false;
		if (id === "categories" && !values.includes(item.category)) return false;
	}
	return true;
}

function sortItems(items: FixtureItem[], sort: SortId | undefined): FixtureItem[] {
	const copy = [...items];
	switch (sort) {
		case "price_asc":
			return copy.sort((a, b) => a.card.price - b.card.price || a.card.id.localeCompare(b.card.id));
		case "price_desc":
			return copy.sort((a, b) => b.card.price - a.card.price || a.card.id.localeCompare(b.card.id));
		case "newest":
			return copy.sort((a, b) => (b.card.createdAt ?? "").localeCompare(a.card.createdAt ?? ""));
		case "name":
			return copy.sort((a, b) => a.card.name.localeCompare(b.card.name));
		default:
			return copy;
	}
}

function counts(pool: FixtureItem[], pick: (item: FixtureItem) => string[]): Map<string, number> {
	const map = new Map<string, number>();
	for (const item of pool) {
		for (const value of pick(item)) map.set(value, (map.get(value) ?? 0) + 1);
	}
	return map;
}

export const fixtureListingProvider: ListingProvider = {
	id: "fixture",
	capabilities: {
		surfaces: ["all", "category", "collection", "search"],
		facetCounts: true,
		pagination: "offset",
		sorts: {
			all: LISTING_SORTS,
			category: LISTING_SORTS,
			collection: LISTING_SORTS,
			search: SEARCH_SORTS,
		},
	},
	freshness: { kind: "ttl", profile: "listingTtl" },
	async load(input) {
		const query = listingQueryWithSupportedSort(fixtureListingProvider, input);
		if (
			(query.surface.kind === "category" || query.surface.kind === "collection") &&
			query.surface.slug === "missing"
		) {
			return null;
		}
		if (query.channel === "boom") {
			throw new Error("fixture transport down");
		}

		const surfacePool = ITEMS.filter((item) => inSurface(item, query));
		const filtered = sortItems(
			surfacePool.filter((item) => matchesRange(item, query) && matchesSelection(item, query)),
			query.sort,
		);
		const pageNumber = query.page.mode === "offset" ? query.page.number : 1;
		const start = (pageNumber - 1) * query.pageSize;
		const items = filtered.slice(start, start + query.pageSize).map((item) => item.card);

		const colorPool = surfacePool.filter(
			(item) => matchesRange(item, query) && matchesSelection(item, query, "colors"),
		);
		const sizePool = surfacePool.filter(
			(item) => matchesRange(item, query) && matchesSelection(item, query, "sizes"),
		);
		const colorCounts = counts(colorPool, (item) => item.card.colors?.map((color) => color.slug) ?? []);
		const sizeCounts = counts(sizePool, (item) => item.card.sizes?.map((size) => size.slug) ?? []);
		const colorSelected = new Set(query.selections.colors ?? []);
		const sizeSelected = new Set(query.selections.sizes ?? []);

		const result: ListingResult = {
			items,
			facets: [
				{
					id: "colors",
					labelKey: "colors",
					control: "swatch",
					values: [...colorCounts.entries()].map(([value, count]) => ({
						value,
						label: value,
						count,
						selected: colorSelected.has(value),
					})),
				},
				{
					id: "sizes",
					labelKey: "sizes",
					control: "chip",
					values: [...sizeCounts.entries()].map(([value, count]) => ({
						value,
						label: value.toUpperCase(),
						count,
						selected: sizeSelected.has(value),
					})),
				},
			],
			sorts: [...(fixtureListingProvider.capabilities.sorts[query.surface.kind] ?? [])],
			page: {
				mode: "offset",
				number: pageNumber,
				hasNextPage: start + query.pageSize < filtered.length,
				hasPreviousPage: pageNumber > 1,
			},
			total: { value: filtered.length, exact: true },
		};
		return result;
	},
};
