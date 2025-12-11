import { ProductList } from "./ProductList";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ArrowRight } from "lucide-react";
import type { ProductListItemFragment } from "@/gql/graphql";

export interface RelatedProductsProps {
	products: readonly ProductListItemFragment[];
	title?: string;
	categorySlug?: string;
}

export function RelatedProducts({ 
	products, 
	title = "You May Also Like",
	categorySlug,
}: RelatedProductsProps) {
	if (!products.length) {
		return null;
	}

	return (
		<section className="mt-16 border-t border-secondary-200 pt-12">
			<div className="flex items-center justify-between mb-8">
				<h2 className="text-2xl font-bold text-secondary-900">{title}</h2>
				{categorySlug && (
					<LinkWithChannel
						href={`/categories/${categorySlug}`}
						className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
					>
						View all
						<ArrowRight className="h-4 w-4" />
					</LinkWithChannel>
				)}
			</div>
			<ProductList 
				products={products.slice(0, 4)} 
				variant="grid"
				columns={4}
				showWishlist={true}
			/>
		</section>
	);
}
