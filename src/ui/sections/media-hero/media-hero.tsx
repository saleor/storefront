import Image from "next/image";
import { PLP_HERO_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { isExternalMenuHref } from "@/lib/menus/menu-item-utils";
import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { buttonClassName } from "@/ui/components/ui/button";

export interface MediaHeroCta {
	label: string;
	href: string;
	variant?: "primary" | "secondary";
}

export type MediaHeroAlign = "center" | "left" | "bottom-left";
export type MediaHeroHeight = "medium" | "tall" | "full";
export type MediaHeroOverlay = "none" | "scrim" | "gradient";
/** Optional frosted card behind copy — solid tone on an opaque surface. */
export type MediaHeroCopySurface = "none" | "panel";

type MediaHeroCopyTone = "solid" | "inverse";

export interface MediaHeroProps {
	eyebrow?: string;
	heading: string;
	subheading?: string;
	primaryCta?: MediaHeroCta;
	secondaryCta?: MediaHeroCta;
	/** Full-bleed background image (LCP). Ignored when `videoSrc` is set. */
	image?: string | null;
	imageAlt?: string;
	/** Autoplay-muted-loop background video (mp4/webm). Uses `image`/`poster` as the poster frame. */
	videoSrc?: string | null;
	poster?: string | null;
	align?: MediaHeroAlign;
	height?: MediaHeroHeight;
	overlay?: MediaHeroOverlay;
	/** Frosted panel behind copy (solid tone). Skips the full-image overlay. */
	copySurface?: MediaHeroCopySurface;
	/** Unique heading id for `aria-labelledby`. */
	id?: string;
	className?: string;
}

const heightClassName: Record<MediaHeroHeight, string> = {
	medium: "min-h-[60vh]",
	tall: "min-h-[78vh] lg:min-h-[88vh]",
	full: "min-h-[100svh]",
};

const alignClassName: Record<MediaHeroAlign, string> = {
	center: "items-center justify-center text-center",
	left: "items-end justify-start text-left",
	"bottom-left": "items-end justify-start text-left",
};

const overlayClassName: Record<MediaHeroOverlay, string> = {
	none: "",
	scrim: "bg-foreground/40",
	gradient: "bg-gradient-to-t from-foreground/70 via-foreground/25 to-transparent",
};

/**
 * Typography on solid vs scrim/panel surfaces. `inverse` uses `text-background` (true
 * near-white) for crisp copy on a photo scrim — NOT `text-inverse*` (muted grays tuned
 * for flat dark bands) and never opacity modifiers (don't compile on oklch CSS-var colors).
 */
const copyToneClassName: Record<MediaHeroCopyTone, { eyebrow: string; heading: string; subheading: string }> =
	{
		solid: {
			eyebrow: "text-muted-foreground",
			heading: "text-foreground",
			subheading: "text-muted-foreground",
		},
		inverse: {
			eyebrow: "text-background",
			heading: "text-background",
			subheading: "text-background",
		},
	};

function resolveCopyTone(
	hasMedia: boolean,
	copySurface: MediaHeroCopySurface,
	overlay: MediaHeroOverlay,
): MediaHeroCopyTone {
	if (!hasMedia || copySurface === "panel" || overlay === "none") {
		return "solid";
	}
	return "inverse";
}

function MediaHeroCtaLink({ cta, className }: { cta: MediaHeroCta; className: string }) {
	if (isExternalMenuHref(cta.href)) {
		return (
			<a href={cta.href} className={className} rel="noopener noreferrer">
				{cta.label}
			</a>
		);
	}
	return (
		<LinkWithChannel href={cta.href} prefetch={false} className={className}>
			{cta.label}
		</LinkWithChannel>
	);
}

/**
 * Full-viewport hero with a photographic or video background and overlaid copy.
 * Copy tone (`solid` | `inverse`) is derived from overlay + copySurface — inverse uses
 * `text-background` (near-white) on photo scrims; solid matches EditorialHero on
 * panels / no media.
 */
export function MediaHero({
	eyebrow,
	heading,
	subheading,
	primaryCta,
	secondaryCta,
	image,
	imageAlt = "",
	videoSrc,
	poster,
	align = "bottom-left",
	height = "tall",
	overlay = "gradient",
	copySurface = "none",
	id = "media-hero-heading",
	className,
}: MediaHeroProps) {
	const hasMedia = Boolean(videoSrc || image);
	const isCenter = align === "center";
	const isSplitLeft = align === "left";
	const useCopyPanel = hasMedia && copySurface === "panel";
	const copyTone = resolveCopyTone(hasMedia, copySurface, overlay);
	const copyColors = copyToneClassName[copyTone];
	const showImageOverlay = hasMedia && !useCopyPanel && overlay !== "none";

	return (
		<section
			className={cn(
				"relative isolate flex flex-col overflow-hidden border-b border-border",
				hasMedia ? "bg-foreground" : "bg-muted",
				heightClassName[height],
				className,
			)}
			aria-labelledby={id}
		>
			{videoSrc ? (
				<video
					className="absolute inset-0 -z-10 h-full w-full object-cover"
					autoPlay
					muted
					loop
					playsInline
					poster={poster ?? image ?? undefined}
					aria-hidden="true"
				>
					<source src={videoSrc} />
				</video>
			) : image ? (
				<Image
					src={image}
					alt={imageAlt}
					fill
					priority
					sizes={PLP_HERO_IMAGE_SIZES}
					quality={PRODUCT_IMAGE_QUALITY}
					className="-z-10 object-cover"
				/>
			) : null}

			{showImageOverlay ? (
				<div className={cn("absolute inset-0 -z-10", overlayClassName[overlay])} aria-hidden="true" />
			) : null}

			<div
				className={cn(
					"w-full text-left",
					isSplitLeft
						? "grid flex-1 items-end lg:grid-cols-2"
						: cn("container-super-wide flex flex-col py-section-lg", alignClassName[align]),
				)}
			>
				<div
					className={cn(
						isSplitLeft
							? "px-4 pb-section-md pt-4 sm:px-6 lg:pb-section-lg lg:pl-8 lg:pr-12 xl:pl-16"
							: undefined,
					)}
				>
					<div
						className={cn(
							isSplitLeft ? "mx-auto w-full max-w-xl lg:mx-0" : cn("max-w-2xl", isCenter && "mx-auto"),
							useCopyPanel && "rounded-card bg-background/80 p-6 shadow-sm backdrop-blur-sm sm:p-8 lg:p-10",
						)}
					>
						{eyebrow ? <p className={cn("text-eyebrow uppercase", copyColors.eyebrow)}>{eyebrow}</p> : null}
						<h1 id={id} className={cn("text-balance text-display", eyebrow && "mt-4", copyColors.heading)}>
							{heading}
						</h1>
						{subheading ? (
							<p
								className={cn(
									"mt-6 max-w-prose text-pretty text-lead",
									isCenter && "mx-auto",
									copyColors.subheading,
								)}
							>
								{subheading}
							</p>
						) : null}
						{(primaryCta || secondaryCta) && (
							<div className={cn("mt-9 flex flex-wrap gap-3", isCenter && "justify-center")}>
								{primaryCta ? (
									<MediaHeroCtaLink
										cta={primaryCta}
										className={buttonClassName({
											asLink: true,
											size: "lg",
											variant: primaryCta.variant === "secondary" ? "secondary" : "default",
											className:
												copyTone === "inverse"
													? "bg-background text-foreground hover:bg-background/90"
													: undefined,
										})}
									/>
								) : null}
								{secondaryCta ? (
									<MediaHeroCtaLink
										cta={secondaryCta}
										className={buttonClassName({
											asLink: true,
											size: "lg",
											variant: secondaryCta.variant === "primary" ? "default" : "outline-solid",
											className:
												copyTone === "inverse"
													? "border-background/30 bg-background/10 text-background hover:bg-background/20"
													: undefined,
										})}
									/>
								) : null}
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
