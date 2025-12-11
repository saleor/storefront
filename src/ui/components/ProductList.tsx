import { ProductElement } from "./ProductElement";
import { type ProductListItemFragment } from "@/gql/graphql";
import { clsx } from "clsx";

export interface ProductListProps {
	products: readonly ProductListItemFragment[];
	variant?: "grid" | "list";
	columns?: 2 | 3 | 4;
	showWishlist?: boolean;
	showQuickView?: boolean;
}

export const ProductList = ({ 
	products, 
	variant = "grid",
	columns = 3,
	showWishlist = true,
	showQuickView = false,
}: ProductListProps) => {
	const gridClasses = {
		2: "sm:grid-cols-2",
		3: "sm:grid-cols-2 lg:grid-cols-3",
		4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
	};

	return (
		<ul
			role="list"
			data-testid="ProductList"
			className={clsx(
				variant === "grid" 
					? `grid grid-cols-1 gap-6 ${gridClasses[columns]}`
					: "flex flex-col gap-4"
			)}
		>
			{products.map((product, index) => (
				<ProductElement
					key={product.id}
					product={product}
					priority={index < 2}
					loading={index < 3 ? "eager" : "lazy"}
					variant={variant}
					showWishlist={showWishlist}
					showQuickView={showQuickView}
				/>
			))}
		</ul>
	);
};
