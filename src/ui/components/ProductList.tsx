// import { ProductElement } from "./ProductElement";
// import { type ProductListItemFragment } from "@/gql/graphql";
//
// export const ProductList = ({ products }: { products: readonly ProductListItemFragment[] }) => {
// 	return (
// 		<ul
// 			role="list"
// 			data-testid="ProductList"
// 			className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
// 		>
// 			{products.map((product, index) => {
// 				// Prioritize first 3 images (first row on mobile/tablet, first on desktop)
// 				const isPriority = index < 3;
// 				// Eager load first 6 images (2 rows on mobile, 1 row on tablet/desktop)
// 				const loading = index < 6 ? "eager" : "lazy";
//
// 				return <ProductElement key={product.id} product={product} priority={isPriority} loading={loading} />;
// 			})}
// 		</ul>
// 	);
// };

import { ProductListEnhanced } from "./ProductListEnhanced";

export const ProductList = ProductListEnhanced;