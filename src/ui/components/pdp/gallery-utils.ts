import type { ProductShell, PdpVariant } from "@/lib/catalog/get-product-data";
import {
	defaultProductImages,
	mediaToProductViewImage,
	type RungMedia,
} from "@/lib/storefront/mappers/gallery-images";
import type { ProductViewImage } from "@/lib/storefront/contract/product";

/**
 * PDP product shape: shell fields from ProductDetails, plus variants merged by
 * dynamic islands via {@link getProductVariantsForPdp}.
 *
 * The static shell never awaits variants — islands attach them so the prerender
 * payload stays lean (PPR).
 */
export type Product = ProductShell & {
	variants?: PdpVariant[] | null;
	/** Saleor total when known (from shell probe or variants fetch). */
	variantTotalCount?: number | null;
	/** True when buy-box strategy is not `matrix` — attribute matrix must not hydrate. */
	overVariantBudget?: boolean;
};
export type Variant = PdpVariant;

export type GalleryImage = ProductViewImage;

/**
 * Aliased rungs from the ProductDetails / VariantDetailsFragment media selections.
 * Required, not optional: if a fragment loses an alias this must fail typecheck rather
 * than quietly fall back to `/_next/image` and start billing transformations again.
 */
type GalleryMedia = RungMedia;

function toGalleryImage(media: GalleryMedia): GalleryImage {
	return mediaToProductViewImage(media);
}

export function getGalleryImages(
	product: Product,
	selectedVariant: Variant | null | undefined,
): GalleryImage[] {
	if (selectedVariant?.media && selectedVariant.media.length > 0) {
		const variantImages = selectedVariant.media.filter((m) => m.type === "IMAGE").map(toGalleryImage);
		if (variantImages.length > 0) {
			return variantImages;
		}
	}

	return defaultProductImages(product);
}

/** Default gallery images for the static shell (no searchParams, no variant payloads). */
export function getDefaultGalleryImages(product: Product): ReturnType<typeof getGalleryImages> {
	return getGalleryImages(product, null);
}

export function resolveSelectedVariantId(
	product: Product,
	variantParam: string | undefined,
): string | undefined {
	const variants = product.variants ?? [];
	if (variantParam) return variantParam;
	if (variants.length === 1) return variants[0]?.id;
	const total = product.variantTotalCount ?? product.productVariants?.totalCount ?? null;
	if (total === 1 && variants[0]?.id) return variants[0].id;
	return undefined;
}
