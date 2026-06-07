import type { ProductListItemFragment } from "@/gql/graphql";
import { ProductCard } from "./product-card";
import type { ProductCardData } from "./product-card-data";
import { toProductCardData } from "./utils";

type ProductGridProps =
	| {
			channel: string;
			products: readonly ProductListItemFragment[];
	  }
	| {
			products: ProductCardData[];
	  };

function ProductGridInner({ products }: { products: ProductCardData[] }) {
	return (
		<div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6" data-testid="ProductList">
			{products.map((product, index) => (
				<ProductCard key={product.id} product={product} priority={index < 3} />
			))}
		</div>
	);
}

export function ProductGrid(props: ProductGridProps) {
	if ("channel" in props) {
		const cards = props.products.map((product) => toProductCardData(product, props.channel));
		return <ProductGridInner products={cards} />;
	}

	return <ProductGridInner products={props.products} />;
}
