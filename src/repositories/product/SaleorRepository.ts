import { type FilterOption, type ProductRepository } from "./types";
import {
	FilterableAttributesDocument,
	OrderDirection,
	ProductOrderField,
	SearchProductsDocument,
	type SearchProductsQueryVariables,
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

import { ProductsPerPage } from "@/app/config";

type GetProductsOptions = SearchProductsQueryVariables;

export const SaleorRepository: ProductRepository = {
	getAll: async (query: string, _filters: FilterOption[] = [], options: Partial<GetProductsOptions> = {}) => {
		const { products } = await executeGraphQL(SearchProductsDocument, {
			variables: {
				search: query,
				first: ProductsPerPage,
				sortBy: ProductOrderField.Rating,
				sortDirection: OrderDirection.Asc,
				after: null,
				channel: "channel-pln",
				...options,
			},
			revalidate: 60,
			withAuth: false,
		});

		if (!products) {
			return {
				cursor: null,
				hasNextPage: false,
				total: 0,
				products: [],
			};
		}

		return {
			cursor: products.pageInfo.endCursor ?? null,
			hasNextPage: products.pageInfo.hasNextPage,
			total: products.totalCount ?? 0,
			products: products.edges.map(({ node }) => ({
				id: node.id,
				name: node.name,
				slug: node.slug,
				thumbnail: node.thumbnail?.url
					? {
							url: node.thumbnail?.url,
							alt: node.thumbnail?.alt ?? node.name,
						}
					: undefined,
				pricing: {
					from: { amount: node.pricing?.priceRange?.start?.gross.amount ?? 0, currency: "USD" },
					to: { amount: node.pricing?.priceRange?.stop?.gross.amount ?? 0, currency: "USD" },
				},
			})),
		};
	},
	getFilters: async () => {
		const { attributes } = await executeGraphQL(FilterableAttributesDocument, {
			variables: { attributeFilterInput: { visibleInStorefront: true } },
			withAuth: false,
		});

		if (!attributes) {
			return {
				filters: [],
			};
		}

		const filters = attributes.edges.map(({ node }) => ({
			name: node.name,
			slug: node.slug,
			options: node.choices?.edges.map(({ node }) => ({ label: node.name, value: node.name })),
		}));

		return {
			filters,
		};
	},
};

// export class SaleorSearchService implements SearchService {
// 	channel: string;
//
// 	constructor(channel: string) {
// 		this.channel = channel;
// 	}
//
// 	async getProducts(query: string, filters: FilterOption[] = [], options: Partial<GetProductsOptions> = {}) {
// 		const { products } = await executeGraphQL(SearchProductsDocument, {
// 			variables: {
// 				search: query,
// 				first: ProductsPerPage,
// 				sortBy: ProductOrderField.Rating,
// 				sortDirection: OrderDirection.Asc,
// 				channel: this.channel,
// 				after: null,
// 				...options,
// 			},
// 			revalidate: 60,
// 			withAuth: false,
// 		});
//
// 		if (!products) {
// 			return {
// 				cursor: null,
// 				hasNextPage: false,
// 				total: 0,
// 				products: [],
// 			};
// 		}
//
// 		return {
// 			cursor: products.pageInfo.endCursor,
// 			hasNextPage: products.pageInfo.hasNextPage,
// 			total: products.totalCount ?? 0,
// 			products: products.edges.map((e) => e.node),
// 		};
// 	}
//
// 	async getFilters() {
// 		const { attributes } = await executeGraphQL(FilterableAttributesDocument, {
// 			variables: { first: 20 },
// 			withAuth: false,
// 		});
//
// 		if (!attributes) {
// 			return {
// 				filters: [],
// 			};
// 		}
//
// 		const filters = attributes.edges.map(({ node }) => ({
// 			name: node.name,
// 			slug: node.slug,
// 			options: node.choices?.edges.map(({ node }) => ({ label: node.name, value: node.name })),
// 		}));
//
// 		return {
// 			filters,
// 		};
// 	}
// }
