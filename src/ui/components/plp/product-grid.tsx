import type { ProductListItemFragment } from "@/gql/graphql";
import { LCP_IMAGE_PRIORITY_COUNT, PLP_IMAGE_SIZES } from "@/lib/images";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";
import type { ProductCardData } from "./product-card-data";
import { toProductCardData } from "./utils";

export type ProductGridDesktopColumns = 3 | 4;

export const productGridDesktopClassName: Record<ProductGridDesktopColumns, string> = {
	3: "lg:grid-cols-3",
	4: "lg:grid-cols-4",
};

type ProductGridProps = {
	desktopColumns?: ProductGridDesktopColumns;
	imageSizes?: string;
} & (
	| {
			locale: string;
			channel: string;
			products: readonly ProductListItemFragment[];
	  }
	| {
			products: ProductCardData[];
	  }
);

function ProductGridInner({
	products,
	imageSizes = PLP_IMAGE_SIZES,
	desktopColumns = 3,
}: {
	products: ProductCardData[];
	imageSizes?: string;
	desktopColumns?: ProductGridDesktopColumns;
}) {
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

export function ProductGrid(props: ProductGridProps) {
	const { imageSizes = PLP_IMAGE_SIZES, desktopColumns = 3 } = props;

	if ("channel" in props) {
		const cards = props.products.map((product) => toProductCardData(product, props.locale, props.channel));
		return <ProductGridInner products={cards} imageSizes={imageSizes} desktopColumns={desktopColumns} />;
	}

	return (
		<ProductGridInner products={props.products} imageSizes={imageSizes} desktopColumns={desktopColumns} />
	);
}
