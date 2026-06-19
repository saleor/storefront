import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LogoStripItem {
	src: string;
	alt: string;
	href?: string;
}

export interface LogoStripProps {
	/** Optional eyebrow heading, e.g. "As seen in" / "Trusted by". */
	heading?: string;
	logos: readonly LogoStripItem[];
	className?: string;
}

/**
 * Press / partner / trust logo strip. Logos sit at reduced opacity and lift on hover.
 * Server Component; logo assets are provided as URLs via props.
 */
export function LogoStrip({ heading, logos, className }: LogoStripProps) {
	if (logos.length === 0) {
		return null;
	}

	return (
		<section
			className={cn("bg-background py-section-sm", className)}
			aria-labelledby={heading ? "logo-strip-heading" : undefined}
		>
			<div className="container-content">
				{heading ? (
					<h2
						id="logo-strip-heading"
						className="mb-8 text-center text-eyebrow uppercase text-muted-foreground"
					>
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
									<a href={logo.href} rel="noopener noreferrer" className="inline-flex">
										{image}
									</a>
								) : (
									image
								)}
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
}
