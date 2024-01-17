import { type SearchIndex } from "algoliasearch/lite";
import { type Filter, type FilterOption, type ProductRepository, type ProductHit } from "./types";

import { algoliaSearchClient } from "@/lib/search";
import { algoliaToProductSerializer } from "@/repositories/product/serializers";

type GetProductsOptions = Parameters<SearchIndex["search"]>[1];

export const AlgoliaRepository2: ProductRepository = {
	getAll: async (query: string, filters: FilterOption[] = [], options: GetProductsOptions = {}) => {
		const searchIndex = algoliaSearchClient.initIndex("channel-pln.PLN.products");
		const _filters = filters.map((filter) => `${filter.label}:${filter.value}`).join(" AND ");
		const results = await searchIndex.search<ProductHit>(query, { filters: _filters, ...options });

		if (!results.hits) {
			return { cursor: null, hasNextPage: false, total: 0, products: [] };
		}

		return {
			cursor: results.page,
			hasNextPage: results.page + 1 < results.nbPages,
			total: results.nbHits,
			products: results.hits.map(algoliaToProductSerializer),
		};
	},
	getFilters: async () => {
		const searchIndex = algoliaSearchClient.initIndex("channel-pln.PLN.products");
		const { facets } = await searchIndex.search("", {
			facets: ["*"],
			sortFacetValuesBy: "alpha",
			responseFields: ["facets"],
		});

		if (!facets) {
			return { filters: [] };
		}

		const filters = Object.keys(facets).reduce<Filter[]>((acc, currentValue) => {
			acc.push({
				name: currentValue,
				slug: currentValue,
				options: Object.keys(facets[currentValue]).map((value) => ({ label: value, value })),
			});

			return acc;
		}, []);

		return { filters };
	},
};

export class AlgoliaRepository implements ProductRepository {
	searchIndex: SearchIndex;
	filters: Filter[];

	constructor(indexName: string) {
		this.searchIndex = algoliaSearchClient.initIndex(indexName);
		this.filters = [];
	}

	async getAll(query: string, filters: FilterOption[] = [], options: GetProductsOptions = {}) {
		const _filters = filters.map((filter) => `${filter.label}:${filter.value}`).join(" AND ");
		const results = await this.searchIndex.search<ProductHit>(query, { filters: _filters, ...options });

		if (!results.hits) {
			return { cursor: null, hasNextPage: false, total: 0, products: [] };
		}

		return {
			cursor: results.page,
			hasNextPage: results.page + 1 < results.nbPages,
			total: results.nbHits,
			products: results.hits.map(algoliaToProductSerializer),
		};
	}

	async getFilters() {
		// Add caching here
		const { facets } = await this.searchIndex.search("", {
			facets: ["*"],
			sortFacetValuesBy: "alpha",
			responseFields: ["facets"],
		});

		if (!facets) {
			return { filters: [] };
		}

		const filters = Object.keys(facets).reduce<Filter[]>((acc, currentValue) => {
			acc.push({
				name: currentValue,
				slug: currentValue,
				options: Object.keys(facets[currentValue]).map((value) => ({ label: value, value })),
			});

			return acc;
		}, []);

		return { filters };
	}
}
