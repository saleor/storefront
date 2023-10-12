import { ProductElement } from "./ProductElement";
import { type ProductFragment } from "@/gql/graphql";

type Props = {
	products: ProductFragment[];
};

export const ProductList = ({ products }: Props) => {
	return (
		<ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" role="list">
			{products.map((product, index) => (
				<ProductElement
					key={product.id}
					product={product}
					loading={index < 4 ? "eager" : "lazy"}
					sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
				/>
			))}
		</ul>
	);
};
