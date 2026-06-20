import { getFeaturedProducts } from "@/lib/catalog/get-featured-products";
import { FEATURED_COLLECTION_IMAGE_SIZES } from "@/lib/images";
import { ProductGrid, type ProductGridDesktopColumns } from "@/ui/components/plp/product-grid";
import { Section, type SectionTone, type SectionWidth } from "@/ui/sections/section";
import { SectionHeader, type SectionHeaderCta } from "@/ui/sections/section-header";

export interface FeaturedCollectionSectionProps {
	locale: string;
	channel: string;
	heading?: string;
	eyebrow?: string;
	intro?: string;
	/** "View all" style link (e.g. to the collection page). */
	cta?: SectionHeaderCta;
	collectionSlug?: string;
	limit?: number;
	desktopColumns?: ProductGridDesktopColumns;
	tone?: SectionTone;
	width?: SectionWidth;
	className?: string;
}

export async function FeaturedCollectionSection({
	locale,
	channel,
	heading = "Featured products",
	eyebrow,
	intro,
	cta,
	collectionSlug = "featured-products",
	limit,
	desktopColumns = 4,
	tone = "default",
	width = "content",
	className,
}: FeaturedCollectionSectionProps) {
	const products = await getFeaturedProducts(channel, locale, limit, collectionSlug);
	const headingId = "featured-collection-heading";

	return (
		<Section
			tone={tone}
			width={width}
			className={className}
			aria-labelledby={heading ? headingId : undefined}
		>
			<SectionHeader
				id={headingId}
				eyebrow={eyebrow}
				heading={heading}
				intro={intro}
				cta={cta}
				className="mb-10"
			/>
			{products.length > 0 ? (
				<ProductGrid
					locale={locale}
					channel={channel}
					products={products}
					imageSizes={FEATURED_COLLECTION_IMAGE_SIZES}
					desktopColumns={desktopColumns}
				/>
			) : (
				<p className="text-muted-foreground">
					No featured products yet. Add products to the {collectionSlug} collection.
				</p>
			)}
		</Section>
	);
}
