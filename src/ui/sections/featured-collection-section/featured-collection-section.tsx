import { getFeaturedProducts } from "@/lib/catalog/get-featured-products";
import { FEATURED_COLLECTION_IMAGE_SIZES } from "@/lib/images";
import { cn } from "@/lib/utils";
import { ProductGrid } from "@/ui/components/plp/product-grid";

export interface FeaturedCollectionSectionProps {
	locale: string;
	channel: string;
	heading?: string;
	collectionSlug?: string;
	limit?: number;
	className?: string;
}

export async function FeaturedCollectionSection({
	locale,
	channel,
	heading = "Featured products",
	collectionSlug = "featured-products",
	limit,
	className,
}: FeaturedCollectionSectionProps) {
	const products = await getFeaturedProducts(channel, locale, limit, collectionSlug);

	return (
		<section
			className={cn("bg-background py-16 md:py-24 lg:py-28", className)}
			aria-labelledby="featured-collection-heading"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h2 id="featured-collection-heading" className="mb-8 text-balance text-h2">
					{heading}
				</h2>
				{products.length > 0 ? (
					<ProductGrid
						locale={locale}
						channel={channel}
						products={products}
						imageSizes={FEATURED_COLLECTION_IMAGE_SIZES}
						desktopColumns={4}
					/>
				) : (
					<p className="text-muted-foreground">
						No featured products yet. Add products to the {collectionSlug} collection.
					</p>
				)}
			</div>
		</section>
	);
}
