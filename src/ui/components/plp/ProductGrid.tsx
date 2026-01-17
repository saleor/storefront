import { ProductCard, type ProductCardData } from "./ProductCard";

interface ProductGridProps {
	products: ProductCardData[];
}

export function ProductGrid({ products }: ProductGridProps) {
	return (
		<div className="grid w-full grid-cols-2 gap-6 lg:gap-8">
			{products.map((product, index) => (
				<ProductCard key={product.id} product={product} priority={index < 2} />
			))}
		</div>
	);
}
