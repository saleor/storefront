import { type ProductDetailsQuery } from "@/gql/graphql";

export type Product = NonNullable<ProductDetailsQuery["product"]>;
export type Variant = NonNullable<Product["variants"]>[number];

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

/** Default gallery images for the static shell (no searchParams). */
export function getDefaultGalleryImages(product: Product): ReturnType<typeof getGalleryImages> {
	const variants = product.variants ?? [];
	const defaultVariant = variants.length === 1 ? variants[0] : null;
	return getGalleryImages(product, defaultVariant);
}

export function resolveSelectedVariantId(
	product: Product,
	variantParam: string | undefined,
): string | undefined {
	const variants = product.variants ?? [];
	return variantParam || (variants.length === 1 ? variants[0].id : undefined);
}
