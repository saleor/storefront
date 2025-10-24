import { ProductCardEnhanced } from "./ProductCardEnhanced";
import { type ProductListItemFragment } from "@/gql/graphql";

interface ProductListEnhancedProps {
	products: readonly ProductListItemFragment[];
}

/**
 * Enhanced product list grid with expandable description cards.
 * Displays products in a responsive grid layout with staggered animations.
 */
export function ProductListEnhanced({ products }: ProductListEnhancedProps) {
	return (
		<ul
			role="list"
			data-testid="ProductListEnhanced"
			className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
		>
			{products.map((product, index) => {
				const isPriority = index < 3;
				const loading = index < 6 ? "eager" : "lazy";
				return (
					<ProductCardEnhanced
						key={product.id}
						product={product}
						priority={isPriority}
						loading={loading}
					/>
				);
			})}
		</ul>
	);
}
