import { ProductElement } from "./ProductElement";
import { type ProductFragment } from "@/gql/graphql";

type Props = {
	products: ProductFragment[];
};

export const ProductList = ({ products }: Props) => {
	return (
		<ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" role="list">
			{products.map((product, index) => (
				<ProductElement key={product.id} product={product} loading={index < 4 ? "eager" : "lazy"} />
			))}
		</ul>
	);
};
