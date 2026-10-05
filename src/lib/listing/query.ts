import { ProductsPerPage } from "@/app/config";
import { PLP_FACETS, parseFacetParam } from "@/config/facets";
import { listingViewFromRecord, type ListingSurface } from "@/lib/catalog/listing-query";
import type { ListingViewParams } from "@/lib/catalog/listing-view";
import { SORT_IDS, type ListingQuery, type SortId } from "@/lib/storefront/contract/listing";

const SORT_ALIASES: Record<string, SortId> = {
	"price-asc": "price_asc",
	"price-desc": "price_desc",
};

export function canonicalSortId(raw: string | undefined): SortId | undefined {
	if (!raw || raw === "featured") return undefined;
	const mapped = SORT_ALIASES[raw] ?? raw;
	return (SORT_IDS as readonly string[]).includes(mapped) ? (mapped as SortId) : undefined;
}

function selectionValues(raw: string | string[] | undefined): string[] {
	if (Array.isArray(raw)) return parseFacetParam(raw.join(","));
	return parseFacetParam(raw);
}

/**
 * URL view → `ListingQuery`. Returns null when a slug or search text is required
 * and missing. Unknown sort tokens are dropped so a junk URL does not 500.
 */
export function listingQueryFromInput(input: {
	surface: ListingSurface;
	locale: string;
	channel: string;
	slug?: string;
	view: ListingViewParams;
	pageSize?: number;
}): ListingQuery | null {
	const view = listingViewFromRecord(input.view);
	const selections: Record<string, string[]> = {};
	for (const facet of PLP_FACETS) {
		const values = selectionValues(view[facet.param as keyof ListingViewParams] as string | undefined);
		if (values.length > 0) selections[facet.id] = values;
	}
	const categories = selectionValues(typeof view.categories === "string" ? view.categories : undefined);
	if (categories.length > 0) selections.categories = categories;

	let range: ListingQuery["range"];
	if (typeof view.price === "string" && view.price) {
		const [minRaw, maxRaw] = view.price.split("-");
		const min = Number(minRaw);
		const max = maxRaw ? Number(maxRaw) : undefined;
		range = {
			price: {
				min: Number.isFinite(min) ? min : 0,
				...(max !== undefined && Number.isFinite(max) ? { max } : {}),
			},
		};
	}

	const pageNumber = typeof view.page === "string" ? Number(view.page) : Number.NaN;
	const direction = view.direction === "prev" || view.direction === "backward" ? "prev" : "next";
	const page: ListingQuery["page"] =
		Number.isInteger(pageNumber) && pageNumber > 0
			? { mode: "offset", number: pageNumber }
			: {
					mode: "cursor",
					cursor: typeof view.cursor === "string" ? view.cursor : undefined,
					direction,
				};

	const text = typeof view.query === "string" ? view.query : "";
	let surface: ListingQuery["surface"];
	if (input.surface === "all") {
		surface = { kind: "all" };
	} else if (input.surface === "search") {
		if (!text) return null;
		surface = { kind: "search", text };
	} else if (!input.slug) {
		return null;
	} else {
		surface = { kind: input.surface, slug: input.slug };
	}

	return {
		surface,
		channel: input.channel,
		locale: input.locale,
		selections,
		range,
		sort: canonicalSortId(typeof view.sort === "string" ? view.sort : undefined),
		page,
		pageSize: input.pageSize ?? ProductsPerPage,
	};
}
