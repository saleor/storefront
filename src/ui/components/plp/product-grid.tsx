import { ProductCard, type ProductCardData } from "./product-card";

interface ProductGridProps {
	products: ProductCardData[];
}

export function ProductGrid({ products }: ProductGridProps) {
	return (
		<div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
			{products.map((product, index) => (
				<ProductCard key={product.id} product={product} priority={index < 3} />
			))}
		</div>
	);
}
