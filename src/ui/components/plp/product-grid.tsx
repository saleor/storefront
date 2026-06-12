import type { ProductListItemFragment } from "@/gql/graphql";
import { LCP_IMAGE_PRIORITY_COUNT, PLP_IMAGE_SIZES } from "@/lib/images";
import { ProductCard } from "./product-card";
import type { ProductCardData } from "./product-card-data";
import { toProductCardData } from "./utils";

type ProductGridProps =
	| {
			locale: string;
			channel: string;
			products: readonly ProductListItemFragment[];
			imageSizes?: string;
	  }
	| {
			products: ProductCardData[];
			imageSizes?: string;
	  };

function ProductGridInner({
	products,
	imageSizes = PLP_IMAGE_SIZES,
}: {
	products: ProductCardData[];
	imageSizes?: string;
}) {
	return (
		<div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6" data-testid="ProductList">
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
	const imageSizes = props.imageSizes ?? PLP_IMAGE_SIZES;

	if ("channel" in props) {
		const cards = props.products.map((product) => toProductCardData(product, props.locale, props.channel));
		return <ProductGridInner products={cards} imageSizes={imageSizes} />;
	}

	return <ProductGridInner products={props.products} imageSizes={imageSizes} />;
}
