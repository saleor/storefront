"use client";

import type { ImageCarouselImage } from "@/ui/components/ui/image-carousel";
import { ProductGallery } from "./product-gallery";

/** Three-column PDP gallery: thumbnail column, then the hero. */
export function ColumnsGallery({
	images,
	productName,
}: {
	images: ImageCarouselImage[];
	productName: string;
}) {
	return <ProductGallery images={images} productName={productName} thumbnailPlacement="start" />;
}
