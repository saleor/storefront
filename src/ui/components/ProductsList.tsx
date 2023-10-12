import { ProductElement } from "./ProductElement";
import { type ProductListItemFragment } from "@/gql/graphql";

export const ProductsList = ({ products }: { products: readonly ProductListItemFragment[] }) => {
	return (
		<ul
			role="list"
			data-testid="ProductsList"
			className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
		>
			{products.map((product, index) => (
				<ProductElement key={product.id} product={product} loading={index < 4 ? "eager" : "lazy"} />
			))}
		</ul>
	);
};
