"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
	applyListingSearchParams,
	isCanonicalListingView,
	listingViewFromSearchParams,
	type ListingPageInfo,
	type ListingPayload,
	type ListingSurface,
} from "@/lib/catalog/listing-query";
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
}: UseListingQueryArgs): UseListingQueryResult {
	const searchParams = useSearchParams();
	const view = useMemo(() => listingViewFromSearchParams(searchParams), [searchParams]);
	const canonical = isCanonicalListingView(view);
	const queryKey = searchParams.toString();

	const [cache, setCache] = useState<{ key: string; payload: ListingPayload } | null>(null);
	const [errorKey, setErrorKey] = useState<string | null>(null);

	useEffect(() => {
		if (canonical) return;

		const params = new URLSearchParams();
		applyListingSearchParams(params, {
			surface,
			locale,
			channel,
			slug,
			view: listingViewFromSearchParams(searchParams),
		});
		const ac = new AbortController();
		const key = queryKey;

		fetch(`/api/listing?${params.toString()}`, { signal: ac.signal })
			.then((response) => {
				if (!response.ok) throw new Error(`listing ${response.status}`);
				return response.json() as Promise<ListingPayload>;
			})
			.then((payload) => {
				setCache({ key, payload });
				setErrorKey((current) => (current === key ? null : current));
			})
			.catch((error: unknown) => {
				if (error instanceof DOMException && error.name === "AbortError") return;
				setErrorKey(key);
			});

		return () => ac.abort();
	}, [canonical, queryKey, surface, locale, channel, slug, searchParams]);

	if (canonical) {
		return {
			products: initialProducts,
			pageInfo: initialPageInfo,
			totalCount: initialTotalCount,
			resolvedCategories: initialResolvedCategories,
			pending: false,
			error: false,
		};
	}

	if (cache?.key === queryKey) {
		return { ...cache.payload, pending: false, error: false };
	}

	return {
		products: initialProducts,
		pageInfo: EMPTY_PAGE_INFO,
		totalCount: 0,
		resolvedCategories: initialResolvedCategories,
		pending: errorKey !== queryKey,
		error: errorKey === queryKey,
	};
}
