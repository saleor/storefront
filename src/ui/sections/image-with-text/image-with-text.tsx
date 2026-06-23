import type { ReactNode } from "react";
import Image from "next/image";
import { PLP_HERO_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { cn } from "@/lib/utils";
import { NavHrefLink } from "@/ui/atoms/nav-href-link";
import { WavePattern } from "@/ui/components/plp/wave-pattern";
import { buttonClassName } from "@/ui/components/ui/button";
import type { SectionTone } from "@/ui/sections/section";

export type ImageWithTextPosition = "left" | "right";

export interface ImageWithTextCta {
	label: string;
	href: string;
}

export type ImageWithTextFit = "cover" | "contain";
export type ImageWithTextWidth = "content" | "wide" | "full";

export interface ImageWithTextProps {
	heading: string;
	paragraphs: readonly string[];
	eyebrow?: string;
	image?: string | null;
	imageAlt?: string;
	imagePosition?: ImageWithTextPosition;
	/** `contain` (on a soft panel) suits studio packshots; `cover` suits lifestyle photos. */
	imageFit?: ImageWithTextFit;
	cta?: ImageWithTextCta;
	tone?: SectionTone;
	width?: ImageWithTextWidth;
	/** Unique heading id for `aria-labelledby` — pass a distinct value when stacking instances. */
	id?: string;
	/** Shown when `image` is absent; defaults to wave pattern. */
	placeholder?: ReactNode;
	className?: string;
}

const toneClassName: Record<SectionTone, string> = {
	default: "bg-background text-foreground",
	muted: "bg-muted text-foreground",
	inverse: "bg-foreground text-inverse",
};

const widthClassName: Record<ImageWithTextWidth, string> = {
	content: "max-w-content",
	wide: "max-w-wide",
	full: "max-w-full",
};

export function ImageWithText({
	heading,
	paragraphs,
	eyebrow,
	image,
	imageAlt = "",
	imagePosition = "left",
	imageFit = "cover",
	cta,
	tone = "default",
	width = "content",
	id = "image-with-text-heading",
	placeholder,
	className,
}: ImageWithTextProps) {
	const hasImage = Boolean(image);
	const isContain = imageFit === "contain";
	const isInverse = tone === "inverse";

	return (
		<section className={cn(toneClassName[tone], className)} aria-labelledby={id}>
			<div className={cn("mx-auto grid lg:grid-cols-2", widthClassName[width])}>
				<div
					className={cn(
						"relative min-h-[320px] overflow-hidden lg:min-h-[480px]",
						isContain && "bg-secondary",
						imagePosition === "right" && "lg:order-2",
					)}
				>
					{hasImage && image ? (
						<Image
							src={image}
							alt={imageAlt}
							fill
							className={cn(isContain ? "object-contain p-10 sm:p-14 lg:p-16" : "object-cover")}
							sizes={PLP_HERO_IMAGE_SIZES}
							quality={PRODUCT_IMAGE_QUALITY}
						/>
					) : (
						(placeholder ?? <WavePattern className="h-full w-full text-secondary" />)
					)}
				</div>

				<div
					className={cn(
						"flex flex-col justify-center px-4 py-section-md sm:px-6 lg:px-12 lg:py-section-lg",
						imagePosition === "right" && "lg:order-1",
					)}
				>
					{eyebrow ? (
						<p
							className={cn(
								"mb-3 text-eyebrow uppercase",
								isInverse ? "text-inverse-muted" : "text-muted-foreground",
							)}
						>
							{eyebrow}
						</p>
					) : null}
					<h2 id={id} className="text-balance text-h2">
						{heading}
					</h2>
					{paragraphs.length > 0 ? (
						<div
							className={cn(
								"mt-5 space-y-5 text-pretty text-lead",
								isInverse ? "text-inverse-subtle" : "text-muted-foreground",
							)}
						>
							{paragraphs.map((paragraph) => (
								<p key={paragraph}>{paragraph}</p>
							))}
						</div>
					) : null}
					{cta ? (
						<div className="mt-8">
							<NavHrefLink href={cta.href} className={buttonClassName({ asLink: true, size: "lg" })}>
								{cta.label}
							</NavHrefLink>
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
}
