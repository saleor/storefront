import { ProductGallery } from "./product-gallery";
import { ProductGalleryShell } from "./product-gallery-shell";
import { ImmersiveGallery } from "./immersive-gallery";
import { ImmersiveGallerySkeleton } from "./immersive-gallery-fallback";
import { PDP_GALLERY_LAYOUT } from "./gallery-layout";
import { getGalleryImages, resolveSelectedVariantId, type Product } from "./gallery-utils";

interface VariantGalleryDynamicProps {
	product: Product;
	searchParams: Promise<{ variant?: string }>;
}

/**
 * Dynamic gallery island for PDP.
 *
 * Reads searchParams in an isolated Suspense boundary so the product shell
 * (h1, attributes, JSON-LD) can stay in the static prerender cache.
 */
export async function VariantGalleryDynamic({ product, searchParams }: VariantGalleryDynamicProps) {
	const { variant: variantParam } = await searchParams;
	const variants = product.variants ?? [];
	const selectedVariantId = resolveSelectedVariantId(product, variantParam);
	const selectedVariant = variants.find((v) => v.id === selectedVariantId);
	const images = getGalleryImages(product, selectedVariant);

	if (PDP_GALLERY_LAYOUT === "immersive") {
		return <ImmersiveGallery images={images} productName={product.name} />;
	}

	return <ProductGallery images={images} productName={product.name} />;
}

export function GallerySkeleton() {
	if (PDP_GALLERY_LAYOUT === "immersive") {
		return <ImmersiveGallerySkeleton />;
	}

	return (
		<ProductGalleryShell imageCount={1} showChrome={false}>
			<div className="relative aspect-[4/5] w-full animate-pulse rounded-lg bg-muted" />
		</ProductGalleryShell>
	);
}
