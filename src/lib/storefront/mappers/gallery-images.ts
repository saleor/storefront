import { buildSaleorSrcSet } from "@/lib/images";
import type { ProductViewImage } from "@/lib/storefront/contract/product";

export type RungMedia = {
	url: string;
	url256: string;
	url512: string;
	url1024: string;
	alt?: string | null;
};

/** Shell and variant media share this shape. One mapper so srcsets cannot drift. */
export function mediaToProductViewImage(media: RungMedia): ProductViewImage {
	return {
		url: media.url,
		alt: media.alt ?? null,
		srcSet: buildSaleorSrcSet([
			{ width: 512, url: media.url512 },
			{ width: 1024, url: media.url1024 },
			{ width: 2048, url: media.url },
		]),
		thumbSrc: media.url256 || media.url512,
		thumbSrcSet: buildSaleorSrcSet([
			{ width: 256, url: media.url256 },
			{ width: 512, url: media.url512 },
		]),
	};
}

type ShellMedia = RungMedia & { type?: string | null };

/**
 * Default gallery images for the static shell: product media, else thumbnail.
 * Variant media is applied later, inside the gallery island.
 */
export function defaultProductImages(product: {
	media?: ShellMedia[] | null;
	thumbnail?: { url: string; alt?: string | null } | null;
}): ProductViewImage[] {
	const fromMedia = (product.media ?? [])
		.filter((media) => media.type === "IMAGE")
		.map(mediaToProductViewImage);
	if (fromMedia.length > 0) return fromMedia;
	if (product.thumbnail?.url) {
		return [{ url: product.thumbnail.url, alt: product.thumbnail.alt ?? null }];
	}
	return [];
}
