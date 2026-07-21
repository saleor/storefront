import type { ProductShell, PdpVariant } from "@/lib/catalog/get-product-data";

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
	/** True when totalCount exceeds PDP_VARIANT_CAP — matrix must not hydrate. */
	overVariantBudget?: boolean;
};

export type Variant = PdpVariant;

export function getGalleryImages(
	product: Product,
	selectedVariant: Variant | null | undefined,
): { url: string; alt: string | null | undefined }[] {
	if (selectedVariant?.media && selectedVariant.media.length > 0) {
		const variantImages = selectedVariant.media
			.filter((m) => m.type === "IMAGE")
			.map((m) => ({ url: m.url, alt: m.alt }));
		if (variantImages.length > 0) {
			return variantImages;
		}
	}

	if (product.media && product.media.length > 0) {
		return product.media.filter((m) => m.type === "IMAGE").map((m) => ({ url: m.url, alt: m.alt }));
	}

	if (product.thumbnail) {
		return [{ url: product.thumbnail.url, alt: product.thumbnail.alt }];
	}

	return [];
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
