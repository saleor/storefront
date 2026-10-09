"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
	applyListingSearchParams,
	listingViewFromSearchParams,
	listingViewKey,
	type ListingPageInfo,
	type ListingPayload,
	type ListingSurface,
} from "@/lib/catalog/listing-query";
import type { ListingViewParams } from "@/lib/catalog/listing-view";
import { emitCommerceEvent } from "@/lib/analytics/emit.client";
import type { ProductCardData } from "./product-card-data";

export type UseListingQueryArgs = {
	surface: ListingSurface;
	locale: string;
	channel: string;
	slug?: string;
	initialProducts: ProductCardData[];
	initialPageInfo: ListingPageInfo;
	initialTotalCount: number;
	initialResolvedCategories?: ListingPayload["resolvedCategories"];
	/**
	 * Listing-param key the server already rendered.
	 * `""` for category / collection / all-products (the unfiltered first page).
	 * The search page passes the key of the query it rendered.
	 */
	initialViewKey?: string;
	providerId?: string;
};

export type UseListingQueryResult = {
	products: ProductCardData[];
	pageInfo: ListingPageInfo;
	totalCount: number;
	resolvedCategories: ListingPayload["resolvedCategories"];
	/** True while a non-canonical URL is fetching — hide the canonical grid. */
	pending: boolean;
	error: boolean;
};

const EMPTY_PAGE_INFO: ListingPageInfo = {
	hasNextPage: false,
	hasPreviousPage: false,
};

/**
 * Canonical URLs use the server-rendered first page. Any listing query fetches
 * `/api/listing` and swaps the grid. Hide the grid until that fetch returns so
 * a shared `?colors=` link does not flash the unfiltered HTML.
 */
export function useListingQuery({
	surface,
	locale,
	channel,
	slug,
	initialProducts,
	initialPageInfo,
	initialTotalCount,
	initialResolvedCategories = [],
	initialViewKey = "",
	providerId = "saleor",
}: UseListingQueryArgs): UseListingQueryResult {
	const searchParams = useSearchParams();
	const view = useMemo(() => listingViewFromSearchParams(searchParams), [searchParams]);
	const viewKey = listingViewKey(view);
	const matchesServer = viewKey === initialViewKey;

	const [cache, setCache] = useState<{ key: string; payload: ListingPayload } | null>(null);
	const [errorKey, setErrorKey] = useState<string | null>(null);

	useEffect(() => {
		if (matchesServer) return;

		const params = new URLSearchParams();
		applyListingSearchParams(params, {
			surface,
			locale,
			channel,
			slug,
			view,
		});
		const ac = new AbortController();
		const key = viewKey;

		fetch(`/api/listing?${params.toString()}`, { signal: ac.signal })
			.then((response) => {
				if (!response.ok) throw new Error(`listing ${response.status}`);
				return response.json() as Promise<ListingPayload>;
			})
			.then((payload) => {
				setCache({ key, payload });
				setErrorKey((current) => (current === key ? null : current));
				emitCommerceEvent({
					name: "listing_filtered",
					channel,
					surface,
					facet: facetForView(view),
					provider: providerId,
				});
			})
			.catch((error: unknown) => {
				if (error instanceof DOMException && error.name === "AbortError") return;
				setErrorKey(key);
			});

		return () => ac.abort();
	}, [matchesServer, viewKey, surface, locale, channel, slug, view, providerId]);

	if (matchesServer) {
		return {
			products: initialProducts,
			pageInfo: initialPageInfo,
			totalCount: initialTotalCount,
			resolvedCategories: initialResolvedCategories,
			pending: false,
			error: false,
		};
	}

	if (cache?.key === viewKey) {
		return { ...cache.payload, pending: false, error: false };
	}

	return {
		products: initialProducts,
		pageInfo: EMPTY_PAGE_INFO,
		totalCount: 0,
		resolvedCategories: initialResolvedCategories,
		pending: errorKey !== viewKey,
		error: errorKey === viewKey,
	};
}

function facetForView(view: ListingViewParams): string {
	if (view.colors) return "colors";
	if (view.sizes) return "sizes";
	if (view.price) return "price";
	if (view.categories) return "categories";
	if (view.sort) return "sort";
	if (view.cursor || view.page) return "page";
	if (view.query) return "query";
	return "mixed";
}
