import { LCP_IMAGE_PRIORITY_COUNT, PLP_IMAGE_SIZES } from "@/lib/images";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";
import type { ProductCardData } from "./product-card-data";

export type ProductGridDesktopColumns = 3 | 4;

export const productGridDesktopClassName: Record<ProductGridDesktopColumns, string> = {
	3: "lg:grid-cols-3",
	4: "lg:grid-cols-4",
};

type ProductGridProps = {
	products: ProductCardData[];
	desktopColumns?: ProductGridDesktopColumns;
	imageSizes?: string;
};

export function ProductGrid({
	products,
	imageSizes = PLP_IMAGE_SIZES,
	desktopColumns = 3,
}: ProductGridProps) {
	return (
		<div
			className={cn("grid w-full grid-cols-2 gap-4 lg:gap-6", productGridDesktopClassName[desktopColumns])}
			data-testid="ProductList"
		>
			{products.map((product, index) => (
				<ProductCard
					key={product.id}
					product={product}
					priority={index < LCP_IMAGE_PRIORITY_COUNT}
					imageSizes={imageSizes}
				/>
			))}
		</div>
	);
}
