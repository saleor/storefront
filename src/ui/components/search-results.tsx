import type { ProductCardData } from "@/ui/components/plp/product-card-data";
import { ProductGrid } from "@/ui/components/plp/product-grid";

interface SearchResultsProps {
	products: ProductCardData[];
}

/**
 * Renders search results using the shared PLP product card and grid.
 */
export function SearchResults({ products }: SearchResultsProps) {
	if (products.length === 0) {
		return null;
	}

	return <ProductGrid products={products} />;
}
