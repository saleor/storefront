import { ProductElement } from "./ProductElement";
import { type ProductListItemFragment } from "@/gql/graphql";

type Props = {
	products: ProductListItemFragment[];
};

export const ProductList = ({ products }: Props) => {
	return (
		<ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" role="list">
			{products.map((product, index) => (
				<ProductElement
					key={product.id}
					product={product}
					//Prioritize first image in the list to speed up above the fold image loading on mobile
					priority={index === 0}
					loading={index < 4 ? "eager" : "lazy"}
				/>
			))}
		</ul>
	);
};
