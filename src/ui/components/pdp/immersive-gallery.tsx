"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PDP_IMMERSIVE_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/ui/components/ui/carousel";
import { type ImageCarouselImage } from "@/ui/components/ui/image-carousel";
import { galleryImageFrameClass } from "@/ui/components/shared/gallery-image-frame";
import { GalleryImageZoomTrigger } from "@/ui/components/shared/gallery-image-zoom-trigger";
import { GalleryZoomLayer } from "./gallery-zoom-layer";
import { PDP_IMMERSIVE_IMAGE_HEIGHT } from "./gallery-layout";
import { useProductImageViewer } from "./use-product-image-viewer";

interface ImmersiveGalleryProps {
	images: ImageCarouselImage[];
	productName: string;
}

/**
 * Immersive PDP gallery (on.com style).
 *
 * Square images in a horizontal filmstrip via Embla (shared `Carousel`
 * primitives). On desktop each image is sized to the available viewport height so
 * the first frame(s) sit above the fold; arrows + counter live below the strip.
 * Touch swipe and desktop click-and-drag use the same engine as `ProductGallery`.
 * Tap an image to open fullscreen pinch-to-zoom.
 */
export function ImmersiveGallery({ images, productName }: ImmersiveGalleryProps) {
	const [api, setApi] = React.useState<CarouselApi>();
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const [canScrollPrev, setCanScrollPrev] = React.useState(false);
	const [canScrollNext, setCanScrollNext] = React.useState(false);

	const imagesKey = images.map((image) => image.url).join(",");
	const { viewerIndex, isViewerOpen, openViewer, onViewerOpenChange } = useProductImageViewer(imagesKey);

	const syncFromApi = React.useCallback((carouselApi: CarouselApi | undefined) => {
		if (!carouselApi) return;
		setSelectedIndex(carouselApi.selectedScrollSnap());
		setCanScrollPrev(carouselApi.canScrollPrev());
		setCanScrollNext(carouselApi.canScrollNext());
	}, []);

	React.useEffect(() => {
		if (!api) return;

		const onSelect = () => syncFromApi(api);
		api.on("select", onSelect);
		api.on("reInit", onSelect);
		onSelect();

		return () => {
			api.off("select", onSelect);
			api.off("reInit", onSelect);
		};
	}, [api, syncFromApi]);

	React.useEffect(() => {
		setSelectedIndex(0);
		api?.scrollTo(0, true);
	}, [imagesKey, api]);

	if (!images.length) {
		return (
			<div className={galleryImageFrameClass("flex aspect-square w-full items-center justify-center")}>
				<span className="text-muted-foreground">No image available</span>
			</div>
		);
	}

	const hasMultiple = images.length > 1;

	return (
		<>
			<div className="flex flex-col gap-4">
				<Carousel
					setApi={setApi}
					opts={{
						align: "start",
						loop: false,
						containScroll: "trimSnaps",
					}}
					className="w-full"
				>
					<CarouselContent className="ml-0 gap-2">
						{images.map((image, index) => (
							<CarouselItem key={image.url} className="basis-full pl-0 lg:basis-auto">
								<GalleryImageZoomTrigger
									onClick={() => openViewer(index)}
									className={cn("aspect-square w-full", PDP_IMMERSIVE_IMAGE_HEIGHT)}
									aria-label={`${productName} - View ${index + 1}`}
								>
									<Image
										src={image.url}
										alt={image.alt || `${productName} - View ${index + 1}`}
										fill
										draggable={false}
										className="pointer-events-none object-cover"
										sizes={PDP_IMMERSIVE_IMAGE_SIZES}
										quality={PRODUCT_IMAGE_QUALITY}
										priority={false}
										loading={index === 0 ? "eager" : "lazy"}
									/>
								</GalleryImageZoomTrigger>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>

				{hasMultiple && (
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="outline-solid"
								size="icon"
								className="rounded-full shadow-none"
								onClick={() => api?.scrollPrev()}
								disabled={!canScrollPrev}
								aria-label="Previous image"
							>
								<ChevronLeft className="h-5 w-5" />
							</Button>
							<Button
								type="button"
								variant="outline-solid"
								size="icon"
								className="rounded-full shadow-none"
								onClick={() => api?.scrollNext()}
								disabled={!canScrollNext}
								aria-label="Next image"
							>
								<ChevronRight className="h-5 w-5" />
							</Button>
						</div>

						<div className="flex items-center gap-1.5">
							{images.map((image, index) => (
								<button
									key={image.url}
									type="button"
									onClick={() => api?.scrollTo(index)}
									aria-label={`Go to image ${index + 1}`}
									aria-current={selectedIndex === index ? "true" : undefined}
									className={cn(
										"h-2 w-2 rounded-full transition-all",
										selectedIndex === index ? "w-5 bg-foreground" : "bg-border hover:bg-muted-foreground",
									)}
								/>
							))}
						</div>

						<span className="text-sm tabular-nums text-muted-foreground" aria-live="polite">
							{selectedIndex + 1} / {images.length}
						</span>
					</div>
				)}
			</div>

			<GalleryZoomLayer
				images={images}
				productName={productName}
				viewerIndex={viewerIndex}
				isViewerOpen={isViewerOpen}
				onOpenChange={onViewerOpenChange}
			/>
		</>
	);
}
