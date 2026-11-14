import { getFeaturedProducts } from "@/lib/catalog/get-featured-products";
import { toProductCardData } from "@/lib/listing/providers/saleor/to-card";
import { getPriceReductionReference } from "@/lib/channels/get-price-display";
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
	const [featured, priceReference] = await Promise.all([
		getFeaturedProducts(channel, locale, limit, collectionSlug),
		getPriceReductionReference(channel),
	]);
	const products = featured.map((product) => toProductCardData(product, locale, channel, priceReference));
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
					products={products}
					imageSizes={FEATURED_COLLECTION_IMAGE_SIZES}
					desktopColumns={desktopColumns}
				/>
			) : (
				<p className="text-muted-foreground">
					Featured products will appear here once added to your catalog.
				</p>
			)}
		</Section>
	);
}
