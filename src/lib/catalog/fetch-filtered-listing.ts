import "server-only";

import {
	OrderDirection,
	ProductListByCategoryDocument,
	ProductListByCollectionDocument,
	ProductListPaginatedDocument,
	ProductOrderField,
	type ProductListItemFragment,
	type ProductOrder,
} from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import { getPaginatedListVariables } from "@/lib/utils";
import { getCategoryData } from "@/lib/catalog/get-category-data";
import { getCollectionData } from "@/lib/catalog/get-collection-data";
import {
	getCategoryListingPage,
	getCollectionListingPage,
	getProductListingPage,
	isCacheableListingView,
	type ListingViewParams,
} from "@/lib/catalog/get-product-listing";
import { buildProductListingConstraints, buildSortVariables } from "@/ui/components/plp/filter-utils";
import { resolveCategorySlugsToIds } from "@/ui/components/plp/filter-utils.server";
import { toProductCardData } from "@/ui/components/plp/utils";
import type { ListingPageInfo, ListingPayload, ListingSurface } from "./listing-query";
import { listingViewFromRecord } from "./listing-query";

export type { ListingPageInfo, ListingPayload, ListingSurface };

export type LoadListingInput = {
	surface: ListingSurface;
	locale: string;
	channel: string;
	slug?: string;
	view: ListingViewParams;
};

type ListingConnection = {
	edges: Array<{ node: ProductListItemFragment }>;
	pageInfo: ListingPageInfo;
	totalCount?: number | null;
};

function resolveSort(surface: ListingSurface, sort: string | undefined): ProductOrder | undefined {
	const fromUrl = buildSortVariables(sort);
	if (fromUrl) return fromUrl;
	if (surface === "collection") {
		return { field: ProductOrderField.Collection, direction: OrderDirection.Asc };
	}
	return undefined;
}

function toPayload(
	connection: ListingConnection,
	locale: string,
	channel: string,
	resolvedCategories: ListingPayload["resolvedCategories"] = [],
): ListingPayload {
	const products = connection.edges.map((edge) => toProductCardData(edge.node, locale, channel));
	return {
		products,
		pageInfo: connection.pageInfo,
		totalCount: connection.totalCount ?? products.length,
		resolvedCategories,
	};
}

async function resolveCategories(view: ListingViewParams): Promise<ListingPayload["resolvedCategories"]> {
	const slugs = view.categories?.split(",").filter(Boolean) ?? [];
	if (slugs.length === 0) return [];
	const categoryMap = await resolveCategorySlugsToIds(slugs);
	return slugs
		.map((slug) => {
			const category = categoryMap.get(slug);
			return category ? { slug, id: category.id, name: category.name } : null;
		})
		.filter((entry): entry is { slug: string; id: string; name: string } => entry !== null);
}

function throwListingFailure(scope: string, message: string): never {
	throw new Error(`[loadListing] ${scope}: ${message}`);
}

async function fetchLiveAll(
	view: ListingViewParams,
	channel: string,
	locale: string,
	sortBy: ProductOrder | undefined,
	categoryIds: string[],
): Promise<ListingConnection | null> {
	const paginationVariables = getPaginatedListVariables({ params: view });
	const { filter, where } = buildProductListingConstraints({
		priceRange: view.price,
		categoryIds,
		colors: view.colors,
		sizes: view.sizes,
	});

	const result = await executePublicGraphQL(ProductListPaginatedDocument, {
		variables: {
			...paginationVariables,
			channel,
			sortBy,
			filter,
			where,
			...graphqlLanguageCodeVariables(locale),
		},
	});

	if (!result.ok) {
		throwListingFailure(`all-products ${channel}`, result.error.message);
	}
	return result.data.products ?? null;
}

async function fetchLiveCategory(
	categorySlug: string,
	view: ListingViewParams,
	channel: string,
	locale: string,
	sortBy: ProductOrder | undefined,
): Promise<ListingConnection | null> {
	const paginationVariables = getPaginatedListVariables({ params: view });
	const { filter, where } = buildProductListingConstraints({
		priceRange: view.price,
		colors: view.colors,
		sizes: view.sizes,
	});

	const result = await executePublicGraphQL(ProductListByCategoryDocument, {
		variables: {
			slug: categorySlug,
			channel,
			...paginationVariables,
			sortBy,
			filter,
			where,
			...graphqlLanguageCodeVariables(locale),
		},
	});

	if (!result.ok) {
		throwListingFailure(`category ${categorySlug} ${channel}`, result.error.message);
	}
	return result.data.category?.products ?? null;
}

async function fetchLiveCollection(
	collectionSlug: string,
	view: ListingViewParams,
	channel: string,
	locale: string,
	sortBy: ProductOrder,
): Promise<ListingConnection | null> {
	const paginationVariables = getPaginatedListVariables({ params: view });
	const { filter, where } = buildProductListingConstraints({
		priceRange: view.price,
		colors: view.colors,
		sizes: view.sizes,
	});

	const result = await executePublicGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: collectionSlug,
			channel,
			...paginationVariables,
			sortBy,
			filter,
			where,
			...graphqlLanguageCodeVariables(locale),
		},
	});

	if (!result.ok) {
		throwListingFailure(`collection ${collectionSlug} ${channel}`, result.error.message);
	}
	return result.data.collection?.products ?? null;
}

/**
 * Listing data for a query string. Sort-only views reuse the `"use cache"` helpers;
 * filters and cursors stay live (long tail).
 *
 * Returns `null` when the category/collection slug does not resolve.
 */
export async function loadListing(input: LoadListingInput): Promise<ListingPayload | null> {
	const view = listingViewFromRecord(input.view);
	const sortBy = resolveSort(input.surface, view.sort);
	const resolvedCategories = input.surface === "all" ? await resolveCategories(view) : [];

	if (input.surface === "all") {
		const connection = isCacheableListingView(view)
			? await getProductListingPage(input.channel, input.locale, sortBy)
			: await fetchLiveAll(
					view,
					input.channel,
					input.locale,
					sortBy,
					resolvedCategories.map((category) => category.id),
				);
		return connection ? toPayload(connection, input.locale, input.channel, resolvedCategories) : null;
	}

	if (!input.slug) return null;

	if (input.surface === "category") {
		const category = await getCategoryData(input.slug, input.channel, input.locale);
		if (!category) return null;
		const connection = isCacheableListingView(view)
			? await getCategoryListingPage(category.slug, input.channel, input.locale, sortBy)
			: await fetchLiveCategory(category.slug, view, input.channel, input.locale, sortBy);
		return connection ? toPayload(connection, input.locale, input.channel) : null;
	}

	const collection = await getCollectionData(input.slug, input.channel, input.locale);
	if (!collection) return null;
	const collectionSort = sortBy ?? {
		field: ProductOrderField.Collection,
		direction: OrderDirection.Asc,
	};
	const connection = isCacheableListingView(view)
		? await getCollectionListingPage(collection.slug, input.channel, input.locale, collectionSort)
		: await fetchLiveCollection(collection.slug, view, input.channel, input.locale, collectionSort);
	return connection ? toPayload(connection, input.locale, input.channel) : null;
}
