import "server-only";

import type { ProductShell } from "@/lib/catalog/get-product-data";

/**
 * Fork-owned extras on `ProductView.extensions`.
 *
 * Add the selection in `src/graphql/extensions/ProductDetailsExtension.graphql`,
 * run `pnpm generate`, then map the new field here. Do not edit
 * `src/lib/storefront/mappers/product.ts` or the product route.
 */
export function mapProductExtensions(_product: ProductShell): Record<string, unknown> {
	return {};
}
