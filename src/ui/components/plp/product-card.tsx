import { ProductCardBase } from "./product-card-base";
import type { ProductCardData } from "./product-card-data";

export type { ProductCardData } from "./product-card-data";

interface ProductCardProps {
	product: ProductCardData;
	priority?: boolean;
}

/** Server-safe product grid cell. Use {@link ProductCardWithQuickAdd} when quick-add is needed. */
export function ProductCard({ product, priority = false }: ProductCardProps) {
	return <ProductCardBase product={product} priority={priority} />;
}
