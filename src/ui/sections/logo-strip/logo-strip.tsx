import Image from "next/image";
import { NavHrefLink } from "@/ui/atoms/nav-href-link";
import { Section, type SectionTone } from "@/ui/sections/section";

export interface LogoStripItem {
	src: string;
	alt: string;
	href?: string;
}

export interface LogoStripProps {
	/** Optional eyebrow heading, e.g. "As seen in" / "Trusted by". */
	heading?: string;
	logos: readonly LogoStripItem[];
	tone?: SectionTone;
	className?: string;
}

/**
 * Press / partner / trust logo strip. Logos sit at reduced opacity and lift on hover.
 * Server Component; logo assets are provided as URLs via props.
 */
export function LogoStrip({ heading, logos, tone = "default", className }: LogoStripProps) {
	if (logos.length === 0) {
		return null;
	}

	const headingId = "logo-strip-heading";

	return (
		<Section tone={tone} spacing="sm" className={className} aria-labelledby={heading ? headingId : undefined}>
			{heading ? (
				<h2 id={headingId} className="mb-8 text-center text-eyebrow uppercase text-muted-foreground">
					{heading}
				</h2>
			) : null}
			<ul className="flex list-none flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-16">
				{logos.map((logo) => {
					const image = (
						<Image
							src={logo.src}
							alt={logo.alt}
							width={120}
							height={40}
							className="h-8 w-auto object-contain opacity-70 transition-opacity duration-base ease-standard hover:opacity-100 motion-reduce:transition-none"
						/>
					);
					return (
						<li key={logo.src}>
							{logo.href ? (
								<NavHrefLink href={logo.href} className="inline-flex">
									{image}
								</NavHrefLink>
							) : (
								image
							)}
						</li>
					);
				})}
			</ul>
		</Section>
	);
}
