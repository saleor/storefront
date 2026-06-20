import type { ReactNode } from "react";
import Image from "next/image";
import { isExternalMenuHref } from "@/lib/menus/menu-item-utils";
import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { buttonClassName } from "@/ui/components/ui/button";

export interface EditorialHeroCta {
	label: string;
	href: string;
	variant?: "primary" | "secondary";
}

export interface EditorialHeroProps {
	/** Short uppercase overline above the heading. */
	eyebrow?: string;
	heading: string;
	subheading?: string;
	primaryCta?: EditorialHeroCta;
	secondaryCta?: EditorialHeroCta;
	/** Large product/editorial image shown on the soft panel beside the copy. */
	image?: string | null;
	imageAlt?: string;
	/** Rendered on the image panel when no image is provided. */
	placeholder?: ReactNode;
	/** Unique heading id for `aria-labelledby`. Override when rendering more than one per page. */
	id?: string;
	className?: string;
}

function HeroCtaLink({ cta, className }: { cta: EditorialHeroCta; className: string }) {
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
 * Full-bleed editorial hero — confident type on a clean canvas beside a large
 * product image on a soft neutral panel. Stacks to a single column on mobile
 * (copy first, image second). Server Component; copy comes from the page.
 */
export function EditorialHero({
	eyebrow,
	heading,
	subheading,
	primaryCta,
	secondaryCta,
	image,
	imageAlt = "",
	placeholder,
	id = "homepage-hero-heading",
	className,
}: EditorialHeroProps) {
	return (
		<section className={cn("border-b border-border bg-background", className)} aria-labelledby={id}>
			<div className="grid items-stretch lg:grid-cols-2">
				<div className="order-2 flex flex-col justify-center px-4 py-section-md sm:px-6 lg:order-1 lg:py-section-lg lg:pl-8 lg:pr-12 xl:pl-16">
					<div className="mx-auto w-full max-w-xl lg:mx-0">
						{eyebrow ? <p className="text-eyebrow uppercase text-muted-foreground">{eyebrow}</p> : null}
						<h1 id={id} className={cn("text-balance text-display text-foreground", eyebrow && "mt-4")}>
							{heading}
						</h1>
						{subheading ? (
							<p className="mt-6 max-w-prose text-pretty text-lead text-muted-foreground">{subheading}</p>
						) : null}
						{(primaryCta || secondaryCta) && (
							<div className="mt-9 flex flex-wrap gap-3">
								{primaryCta ? (
									<HeroCtaLink
										cta={primaryCta}
										className={buttonClassName({
											asLink: true,
											size: "lg",
											variant: primaryCta.variant === "secondary" ? "secondary" : "default",
										})}
									/>
								) : null}
								{secondaryCta ? (
									<HeroCtaLink
										cta={secondaryCta}
										className={buttonClassName({
											asLink: true,
											size: "lg",
											variant: secondaryCta.variant === "primary" ? "default" : "outline-solid",
										})}
									/>
								) : null}
							</div>
						)}
					</div>
				</div>

				<div className="relative order-1 min-h-[52vh] overflow-hidden bg-secondary lg:order-2 lg:min-h-[80vh]">
					{image ? (
						<Image
							src={image}
							alt={imageAlt}
							fill
							priority
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-contain p-10 sm:p-16 lg:p-20"
						/>
					) : (
						placeholder
					)}
				</div>
			</div>
		</section>
	);
}
