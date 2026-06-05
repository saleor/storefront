import { ProductGallery } from "./product-gallery";
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

	return <ProductGallery images={images} productName={product.name} />;
}

export function GallerySkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<div className="aspect-[4/5] w-full animate-pulse rounded-lg bg-muted" />
			<div className="hidden gap-2 sm:flex">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="h-20 w-20 animate-pulse rounded-md bg-muted" />
				))}
			</div>
			<div className="flex justify-center gap-1.5 sm:hidden">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="h-2 w-2 animate-pulse rounded-full bg-muted" />
				))}
			</div>
		</div>
	);
}
