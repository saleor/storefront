import { ProductElement } from "./product-element";
import { type ProductListItemFragment } from "@/gql/graphql";
import { LCP_IMAGE_PRIORITY_COUNT } from "@/lib/images";

export const ProductList = ({
	products,
	channel,
}: {
	products: readonly ProductListItemFragment[];
	channel: string;
}) => {
	return (
		<ul
			role="list"
			data-testid="ProductList"
			className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
		>
			{products.map((product, index) => (
				<ProductElement
					key={product.id}
					product={product}
					channel={channel}
					priority={index < LCP_IMAGE_PRIORITY_COUNT}
				/>
			))}
		</ul>
	);
};
