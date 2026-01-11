/**
 * Search Module
 *
 * Provides types and utilities for integrating search engines.
 * Does NOT enforce a rigid provider interface - use each SDK's full capabilities.
 *
 * ## Quick Start
 *
 * 1. Import the types: `import type { SearchProduct, SearchResult } from "@/lib/search"`
 * 2. Use your search SDK directly
 * 3. Transform results to SearchProduct for the UI
 *
 * ## Example: Typesense
 *
 * ```typescript
 * import Typesense from "typesense";
 * import type { SearchProduct } from "@/lib/search";
 *
 * const client = new Typesense.Client({
 *   nodes: [{ host: "xxx.typesense.net", port: 443, protocol: "https" }],
 *   apiKey: process.env.TYPESENSE_SEARCH_KEY!,
 * });
 *
 * export async function searchProducts(query: string) {
 *   const results = await client.collections("products").documents().search({
 *     q: query,
 *     query_by: "name,description,category",
 *     facet_by: "category,brand,price_range",
 *     filter_by: "in_stock:true",
 *     // Use ALL Typesense features!
 *   });
 *
 *   return results.hits?.map((hit) => ({
 *     id: hit.document.id,
 *     name: hit.document.name,
 *     slug: hit.document.slug,
 *     price: hit.document.price,
 *     currency: "USD",
 *     thumbnailUrl: hit.document.image_url,
 *     highlights: { name: hit.highlight?.name?.snippet },
 *     score: hit.text_match,
 *   })) satisfies SearchProduct[];
 * }
 * ```
 *
 * ## Example: Algolia
 *
 * ```typescript
 * import algoliasearch from "algoliasearch";
 * import type { SearchProduct } from "@/lib/search";
 *
 * const client = algoliasearch(
 *   process.env.ALGOLIA_APP_ID!,
 *   process.env.ALGOLIA_SEARCH_KEY!
 * );
 * const index = client.initIndex("products");
 *
 * export async function searchProducts(query: string, options?: {
 *   filters?: string;
 *   facets?: string[];
 *   page?: number;
 *   hitsPerPage?: number;
 *   // Use ALL Algolia options!
 *   enablePersonalization?: boolean;
 *   getRankingInfo?: boolean;
 * }) {
 *   const results = await index.search(query, {
 *     ...options,
 *     attributesToRetrieve: ["name", "slug", "price", "image", "category"],
 *     attributesToHighlight: ["name", "description"],
 *   });
 *
 *   return {
 *     products: results.hits.map((hit) => ({
 *       id: hit.objectID,
 *       name: hit.name,
 *       slug: hit.slug,
 *       price: hit.price,
 *       currency: "USD",
 *       thumbnailUrl: hit.image,
 *       highlights: { name: hit._highlightResult?.name?.value },
 *       _raw: hit, // Keep full Algolia hit for advanced use
 *     })) satisfies SearchProduct[],
 *     facets: results.facets,
 *     nbHits: results.nbHits,
 *     page: results.page,
 *   };
 * }
 * ```
 *
 * ## Example: Meilisearch
 *
 * ```typescript
 * import { MeiliSearch } from "meilisearch";
 * import type { SearchProduct } from "@/lib/search";
 *
 * const client = new MeiliSearch({
 *   host: process.env.MEILISEARCH_HOST!,
 *   apiKey: process.env.MEILISEARCH_API_KEY!,
 * });
 *
 * export async function searchProducts(query: string) {
 *   const results = await client.index("products").search(query, {
 *     attributesToHighlight: ["name", "description"],
 *     facets: ["category", "brand"],
 *     filter: ["in_stock = true"],
 *     // Use ALL Meilisearch features!
 *   });
 *
 *   return results.hits.map((hit) => ({
 *     id: hit.id,
 *     name: hit.name,
 *     slug: hit.slug,
 *     price: hit.price,
 *     currency: "USD",
 *     thumbnailUrl: hit.image,
 *     highlights: { name: hit._formatted?.name },
 *   })) satisfies SearchProduct[];
 * }
 * ```
 */

// Export types for use in implementations
export * from "./types";

// Export Saleor implementation for the demo
export { searchProducts } from "./saleor-provider";
