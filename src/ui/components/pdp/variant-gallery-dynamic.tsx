import { resolvePdpVariants } from "@/lib/catalog/get-product-data";
import { activeGalleryVariant } from "./gallery-registry";
import { getGalleryImages, resolveSelectedVariantId, type Product } from "./gallery-utils";

interface VariantGalleryDynamicProps {
	product: Product;
	channel: string;
	localeSlug: string;
	searchParams: Promise<{ variant?: string }>;
}

/**
 * Dynamic gallery island for PDP.
 *
 * Reads searchParams in an isolated Suspense boundary so the product shell
 * (h1, attributes, JSON-LD) can stay in the static prerender cache. Variants
 * are resolved here (cached) so the shell never ships variant payloads.
 * The active renderer comes from the gallery registry — see `gallery-registry.tsx`.
 */
export async function VariantGalleryDynamic({
	product,
	channel,
	localeSlug,
	searchParams,
}: VariantGalleryDynamicProps) {
	const { variant: variantParam } = await searchParams;
	const { variants, totalCount, overBudget } = await resolvePdpVariants(product, channel, localeSlug, {
		variantId: variantParam,
	});

	const productWithVariants: Product = {
		...product,
		variants,
		variantTotalCount: totalCount,
		overVariantBudget: overBudget,
	};
	const selectedVariantId = resolveSelectedVariantId(productWithVariants, variantParam);
	const selectedVariant = variants.find((v) => v.id === selectedVariantId);
	const images = getGalleryImages(productWithVariants, selectedVariant);

	const { Gallery } = activeGalleryVariant();
	return <Gallery images={images} productName={product.name} />;
}

export function GallerySkeleton() {
	const { Skeleton } = activeGalleryVariant();
	return <Skeleton />;
}
