import Image from "next/image";
import { PLP_HERO_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { isExternalMenuHref } from "@/lib/menus/menu-item-utils";
import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { buttonClassName } from "@/ui/components/ui/button";

export type HeroBannerHeight = "compact" | "default" | "large";

export interface HeroBannerCta {
	label: string;
	href: string;
	variant?: "primary" | "secondary";
}

export interface HeroBannerProps {
	heading: string;
	subheading?: string;
	primaryCta?: HeroBannerCta;
	secondaryCta?: HeroBannerCta;
	backgroundImage?: string | null;
	backgroundImageAlt?: string;
	height?: HeroBannerHeight;
	className?: string;
}

const heightClassName: Record<HeroBannerHeight, string> = {
	compact: "min-h-[280px] md:min-h-[320px]",
	default: "min-h-[360px] md:min-h-[420px]",
	large: "min-h-[420px] md:min-h-[520px]",
};

function HeroBannerCtaLink({ cta, className }: { cta: HeroBannerCta; className: string }) {
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

export function HeroBanner({
	heading,
	subheading,
	primaryCta,
	secondaryCta,
	backgroundImage,
	backgroundImageAlt = "",
	height = "default",
	className,
}: HeroBannerProps) {
	const hasImage = Boolean(backgroundImage);

	return (
		<section
			className={cn("relative overflow-hidden border-b border-border", heightClassName[height], className)}
			aria-labelledby="homepage-hero-heading"
		>
			{hasImage && backgroundImage ? (
				<div className="absolute inset-0">
					<Image
						src={backgroundImage}
						alt={backgroundImageAlt}
						fill
						className="object-cover"
						sizes={PLP_HERO_IMAGE_SIZES}
						quality={PRODUCT_IMAGE_QUALITY}
						priority
					/>
					<div className="from-foreground/70 via-foreground/40 absolute inset-0 bg-gradient-to-r to-transparent" />
				</div>
			) : null}

			<div className="relative mx-auto flex h-full min-h-[inherit] max-w-7xl flex-col justify-end px-4 pb-10 pt-16 sm:px-6 sm:pb-12 lg:px-8">
				<div className="max-w-2xl">
					<h1
						id="homepage-hero-heading"
						className={cn("text-balance text-display", hasImage ? "text-background" : "text-foreground")}
					>
						{heading}
					</h1>
					{subheading ? (
						<p
							className={cn(
								"mt-5 text-pretty text-lead md:mt-6",
								hasImage ? "text-background/85" : "text-muted-foreground",
							)}
						>
							{subheading}
						</p>
					) : null}
					{(primaryCta || secondaryCta) && (
						<div className="mt-8 flex flex-wrap gap-3">
							{primaryCta ? (
								<HeroBannerCtaLink
									cta={primaryCta}
									className={buttonClassName({
										asLink: true,
										size: "lg",
										variant: primaryCta.variant === "secondary" ? "secondary" : "default",
										className: hasImage && primaryCta.variant !== "secondary" ? "shadow-md" : undefined,
									})}
								/>
							) : null}
							{secondaryCta ? (
								<HeroBannerCtaLink
									cta={secondaryCta}
									className={buttonClassName({
										asLink: true,
										size: "lg",
										variant: secondaryCta.variant === "primary" ? "default" : "outline-solid",
										className: hasImage
											? "border-background/30 bg-background/10 hover:bg-background/20 text-background"
											: undefined,
									})}
								/>
							) : null}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
