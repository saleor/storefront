import type { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

/**
 * Canonical PDP image tile surface — shared by every gallery layout.
 *
 * `isolate` + `overflow-hidden` + matching `rounded-lg` prevents Next/Image and
 * carousel viewport layers from bleeding or clipping at mismatched radii.
 *
 * For tap-to-zoom controls, use {@link GalleryImageZoomTrigger} — never put
 * `overflow-hidden` on the same element that receives focus rings.
 */
export const PDP_GALLERY_IMAGE_FRAME_CLASS = "relative isolate overflow-hidden rounded-lg bg-secondary";

/**
 * Inner clip layer for zoom triggers — inherits the trigger's border radius and
 * holds the image so its corners are clipped. `pointer-events-none` keeps clicks
 * on the button itself.
 */
export const PDP_GALLERY_IMAGE_CLIP_CLASS =
	"pointer-events-none absolute inset-0 isolate overflow-hidden rounded-[inherit] bg-secondary";

/**
 * Focus indicator drawn as an inset overlay ON TOP of the image. Inset rings live
 * inside the element box, so an ancestor carousel `overflow:hidden` viewport can
 * never clip them (the previous outer `ring-offset` approach was being sliced by
 * the Embla viewport between slides).
 */
export const PDP_GALLERY_IMAGE_FOCUS_OVERLAY_CLASS =
	"pointer-events-none absolute inset-0 rounded-[inherit] ring-inset ring-ring transition-[box-shadow] group-focus-visible:ring-2";

/** Marks the focusable shell as a group and removes the default outline. */
export const PDP_GALLERY_IMAGE_FOCUS_CLASS = "group focus-visible:outline-none";

/** Outer tap-to-zoom `<button>` shell — rounded, no overflow clip (ring is inset overlay). */
export const PDP_GALLERY_IMAGE_ZOOM_TRIGGER_CLASS = cn(
	"relative block w-full cursor-zoom-in rounded-lg",
	PDP_GALLERY_IMAGE_FOCUS_CLASS,
);

export function galleryImageFrameClass(...mix: ClassValue[]) {
	return cn(PDP_GALLERY_IMAGE_FRAME_CLASS, ...mix);
}

export function galleryImageZoomTriggerClass(...mix: ClassValue[]) {
	return cn(PDP_GALLERY_IMAGE_ZOOM_TRIGGER_CLASS, ...mix);
}

/** Empty-state hero tile (standard / mosaic). */
export const PDP_GALLERY_EMPTY_IMAGE_FRAME_CLASS = galleryImageFrameClass(
	"flex aspect-[4/5] w-full items-center justify-center",
);

interface GalleryImageFrameProps extends React.ComponentProps<"div"> {
	className?: string;
}

export function GalleryImageFrame({ className, children, ...props }: GalleryImageFrameProps) {
	return (
		<div className={galleryImageFrameClass(className)} {...props}>
			{children}
		</div>
	);
}
