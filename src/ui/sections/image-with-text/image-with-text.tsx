import type { ReactNode } from "react";
import Image from "next/image";
import { PLP_HERO_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { isExternalMenuHref } from "@/lib/menus/menu-item-utils";
import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { WavePattern } from "@/ui/components/plp/wave-pattern";
import { buttonClassName } from "@/ui/components/ui/button";

export type ImageWithTextPosition = "left" | "right";

export interface ImageWithTextCta {
	label: string;
	href: string;
}

export interface ImageWithTextProps {
	heading: string;
	paragraphs: readonly string[];
	image?: string | null;
	imageAlt?: string;
	imagePosition?: ImageWithTextPosition;
	cta?: ImageWithTextCta;
	/** Shown when `image` is absent; defaults to wave pattern. */
	placeholder?: ReactNode;
	className?: string;
}

export function ImageWithText({
	heading,
	paragraphs,
	image,
	imageAlt = "",
	imagePosition = "left",
	cta,
	placeholder,
	className,
}: ImageWithTextProps) {
	const hasImage = Boolean(image);

	return (
		<section className={cn("bg-background", className)} aria-labelledby="image-with-text-heading">
			<div className="mx-auto grid max-w-7xl lg:grid-cols-2">
				<div
					className={cn(
						"relative min-h-[280px] overflow-hidden lg:min-h-[420px]",
						imagePosition === "right" && "lg:order-2",
					)}
				>
					{hasImage && image ? (
						<Image
							src={image}
							alt={imageAlt}
							fill
							className="object-cover"
							sizes={PLP_HERO_IMAGE_SIZES}
							quality={PRODUCT_IMAGE_QUALITY}
						/>
					) : (
						placeholder ?? <WavePattern className="h-full w-full text-secondary" />
					)}
				</div>

				<div
					className={cn(
						"flex flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-24",
						imagePosition === "right" && "lg:order-1",
					)}
				>
					<h2 id="image-with-text-heading" className="text-balance text-h2">
						{heading}
					</h2>
					{paragraphs.length > 0 ? (
						<div className="mt-5 space-y-5 text-pretty text-lead text-muted-foreground">
							{paragraphs.map((paragraph) => (
								<p key={paragraph}>{paragraph}</p>
							))}
						</div>
					) : null}
					{cta ? (
						<div className="mt-8">
							{isExternalMenuHref(cta.href) ? (
								<a
									href={cta.href}
									className={buttonClassName({ asLink: true, size: "lg" })}
									rel="noopener noreferrer"
								>
									{cta.label}
								</a>
							) : (
								<LinkWithChannel
									href={cta.href}
									prefetch={false}
									className={buttonClassName({ asLink: true, size: "lg" })}
								>
									{cta.label}
								</LinkWithChannel>
							)}
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
}
