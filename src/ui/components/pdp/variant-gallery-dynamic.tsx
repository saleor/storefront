import { activeGalleryVariant } from "./gallery-registry";
import { getGalleryImages, resolveSelectedVariantId, type Product } from "./gallery-utils";

interface VariantGalleryDynamicProps {
	product: Product;
	searchParams: Promise<{ variant?: string }>;
}

/**
 * Dynamic gallery island for PDP.
 *
 * Reads searchParams in an isolated Suspense boundary so the product shell
 * (h1, attributes, JSON-LD) can stay in the static prerender cache. The active
 * renderer comes from the gallery registry — see `gallery-registry.tsx`.
 */
export async function VariantGalleryDynamic({ product, searchParams }: VariantGalleryDynamicProps) {
	const { variant: variantParam } = await searchParams;
	const variants = product.variants ?? [];
	const selectedVariantId = resolveSelectedVariantId(product, variantParam);
	const selectedVariant = variants.find((v) => v.id === selectedVariantId);
	const images = getGalleryImages(product, selectedVariant);

	const { Gallery } = activeGalleryVariant();
	return <Gallery images={images} productName={product.name} />;
}

export function GallerySkeleton() {
	const { Skeleton } = activeGalleryVariant();
	return <Skeleton />;
}
