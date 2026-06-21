"use client";

import dynamic from "next/dynamic";
import { type ImageCarouselImage } from "@/ui/components/ui/image-carousel";

const ProductImageViewer = dynamic(
	() => import("./product-image-viewer").then((mod) => mod.ProductImageViewer),
	{ ssr: false },
);

interface GalleryZoomLayerProps {
	images: ImageCarouselImage[];
	productName: string;
	viewerIndex: number | null;
	isViewerOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

/** Lazy fullscreen pinch-zoom — shared by all interactive PDP gallery layouts. */
export function GalleryZoomLayer({
	images,
	productName,
	viewerIndex,
	isViewerOpen,
	onOpenChange,
}: GalleryZoomLayerProps) {
	if (!isViewerOpen || viewerIndex === null) {
		return null;
	}

	return (
		<ProductImageViewer
			images={images}
			productName={productName}
			initialIndex={viewerIndex}
			open={isViewerOpen}
			onOpenChange={onOpenChange}
		/>
	);
}
