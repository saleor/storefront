import { getFeaturedProducts } from "@/lib/catalog/get-featured-products";
import { HOMEPAGE_IMAGE_SIZES } from "@/lib/images";
import { cn } from "@/lib/utils";
import { ProductGrid } from "@/ui/components/plp/product-grid";

export interface FeaturedCollectionSectionProps {
	channel: string;
	heading?: string;
	collectionSlug?: string;
	limit?: number;
	className?: string;
}

export async function FeaturedCollectionSection({
	channel,
	heading = "Featured products",
	collectionSlug = "featured-products",
	limit,
	className,
}: FeaturedCollectionSectionProps) {
	const products = await getFeaturedProducts(channel, limit, collectionSlug);

	return (
		<section
			className={cn("bg-background py-10 md:py-12", className)}
			aria-labelledby="featured-collection-heading"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h2
					id="featured-collection-heading"
					className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl"
				>
					{heading}
				</h2>
				{products.length > 0 ? (
					<ProductGrid channel={channel} products={products} imageSizes={HOMEPAGE_IMAGE_SIZES} />
				) : (
					<p className="text-muted-foreground">
						No featured products yet. Add products to the {collectionSlug} collection.
					</p>
				)}
			</div>
		</section>
	);
}
