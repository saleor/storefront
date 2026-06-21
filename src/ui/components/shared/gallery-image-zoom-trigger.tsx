"use client";

import { cn } from "@/lib/utils";
import {
	galleryImageZoomTriggerClass,
	PDP_GALLERY_IMAGE_CLIP_CLASS,
	PDP_GALLERY_IMAGE_FOCUS_CLASS,
	PDP_GALLERY_IMAGE_FOCUS_OVERLAY_CLASS,
} from "./gallery-image-frame";

interface GalleryImageZoomTriggerProps extends React.ComponentProps<"button"> {
	className?: string;
}

/**
 * Tap-to-zoom control. The image lives inside a clip layer (rounded corners) and
 * the keyboard focus ring is an inset overlay on top, so an ancestor carousel
 * `overflow:hidden` viewport can never clip it.
 */
export function GalleryImageZoomTrigger({ className, children, ...props }: GalleryImageZoomTriggerProps) {
	return (
		<button type="button" className={galleryImageZoomTriggerClass(className)} {...props}>
			<span className={PDP_GALLERY_IMAGE_CLIP_CLASS}>{children}</span>
			<span className={PDP_GALLERY_IMAGE_FOCUS_OVERLAY_CLASS} aria-hidden />
		</button>
	);
}

interface GalleryImageThumbTriggerProps extends React.ComponentProps<"button"> {
	className?: string;
	selected?: boolean;
}

/** Thumbnail carousel control — inset focus ring + selected ring on top of the clip. */
export function GalleryImageThumbTrigger({
	className,
	selected = false,
	children,
	...props
}: GalleryImageThumbTriggerProps) {
	return (
		<button
			type="button"
			className={cn(
				"relative h-20 w-20 shrink-0 rounded-md",
				PDP_GALLERY_IMAGE_FOCUS_CLASS,
				selected ? "opacity-100" : "opacity-60 hover:opacity-100",
				className,
			)}
			{...props}
		>
			<span className={cn(PDP_GALLERY_IMAGE_CLIP_CLASS, "rounded-md")}>{children}</span>
			<span
				className={cn(
					PDP_GALLERY_IMAGE_FOCUS_OVERLAY_CLASS,
					"rounded-md",
					selected && "ring-2 ring-foreground",
				)}
				aria-hidden
			/>
		</button>
	);
}
