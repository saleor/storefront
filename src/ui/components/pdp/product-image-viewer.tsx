"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { cn } from "@/lib/utils";
import { Logo } from "@/ui/components/shared/logo";
import { Button } from "@/ui/components/ui/button";
import {
	Dialog,
	DialogCloseButton,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/ui/components/ui/dialog";
import { type ImageCarouselImage } from "@/ui/components/ui/image-carousel";

interface ProductImageViewerProps {
	images: ImageCarouselImage[];
	productName: string;
	initialIndex: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ProductImageViewer({
	images,
	productName,
	initialIndex,
	open,
	onOpenChange,
}: ProductImageViewerProps) {
	const t = useTranslations("pdp.zoom");
	const [index, setIndex] = React.useState(initialIndex);
	const transformRef = React.useRef<ReactZoomPanPinchRef>(null);

	const image = images[index];
	const hasMultiple = images.length > 1;

	React.useEffect(() => {
		if (open) {
			setIndex(initialIndex);
		}
	}, [open, initialIndex]);

	React.useEffect(() => {
		transformRef.current?.resetTransform(0);
	}, [index]);

	const goToPrevious = React.useCallback(() => {
		setIndex((current) => (current > 0 ? current - 1 : images.length - 1));
	}, [images.length]);

	const goToNext = React.useCallback(() => {
		setIndex((current) => (current < images.length - 1 ? current + 1 : 0));
	}, [images.length]);

	React.useEffect(() => {
		if (!open) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				goToPrevious();
			}
			if (event.key === "ArrowRight") {
				event.preventDefault();
				goToNext();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, goToPrevious, goToNext]);

	if (!image) return null;

	const alt = image.alt || t("imageAlt", { productName, index: index + 1 });

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				fullscreen
				className="border-0 bg-background p-0 shadow-none"
				onOpenAutoFocus={(event) => event.preventDefault()}
			>
				<DialogTitle className="sr-only">{t("title", { productName })}</DialogTitle>
				<DialogDescription className="sr-only">{alt}</DialogDescription>

				<div className="relative isolate flex h-[100dvh] w-full flex-col overflow-hidden bg-background">
					<header className="relative z-20 flex shrink-0 items-center justify-between px-4 pb-2 pt-4">
						<Logo className="h-6 w-auto" ariaLabel="" />
						<DialogCloseButton className="text-foreground hover:bg-accent" aria-label={t("close")} />
					</header>

					<div className="relative min-h-0 flex-1 touch-none">
						<TransformWrapper
							ref={transformRef}
							initialScale={1}
							minScale={1}
							maxScale={4}
							centerOnInit
							doubleClick={{ mode: "toggle", step: 2 }}
							wheel={{ step: 0.12 }}
							pinch={{ step: 5 }}
							panning={{ velocityDisabled: true }}
						>
							<TransformComponent
								wrapperClass="!size-full ![overflow:visible]"
								contentClass="!flex !size-full !items-center !justify-center"
								wrapperStyle={{ width: "100%", height: "100%" }}
								contentStyle={{ width: "100%", height: "100%" }}
							>
								{/* eslint-disable-next-line @next/next/no-img-element -- smoother pinch/pan than next/image inside transforms */}
								<img
									key={image.url}
									src={image.url}
									alt={alt}
									draggable={false}
									className="max-h-full max-w-full select-none object-contain"
								/>
							</TransformComponent>
						</TransformWrapper>
					</div>

					{hasMultiple && (
						<footer className="relative z-20 flex shrink-0 justify-center px-4 pb-4 pt-2">
							<span className="text-sm tabular-nums text-muted-foreground" aria-live="polite">
								{t("counter", { current: index + 1, total: images.length })}
							</span>
						</footer>
					)}

					{hasMultiple && (
						<div className="pointer-events-none absolute inset-x-0 bottom-12 top-14 z-10 flex items-center justify-between px-2">
							<Button
								type="button"
								variant="outline-solid"
								size="icon"
								className={cn("pointer-events-auto rounded-full bg-background/90 shadow-md")}
								onClick={goToPrevious}
								aria-label={t("previous")}
							>
								<ChevronLeft className="h-5 w-5" />
							</Button>
							<Button
								type="button"
								variant="outline-solid"
								size="icon"
								className={cn("pointer-events-auto rounded-full bg-background/90 shadow-md")}
								onClick={goToNext}
								aria-label={t("next")}
							>
								<ChevronRight className="h-5 w-5" />
							</Button>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
