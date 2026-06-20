import { cn } from "@/lib/utils";
import { Section, type SectionTone, type SectionWidth } from "@/ui/sections/section";
import { SectionHeader } from "@/ui/sections/section-header";

export interface TestimonialItem {
	quote: string;
	author: string;
	/** Role, location, or other attribution detail. */
	detail?: string;
}

export interface TestimonialSectionProps {
	heading?: string;
	eyebrow?: string;
	intro?: string;
	testimonials: readonly TestimonialItem[];
	tone?: SectionTone;
	width?: SectionWidth;
	className?: string;
}

/**
 * Social-proof band: one centered quote, or a 2–3 column grid of quote cards.
 * Server Component, token-driven. Copy comes from the content layer / props.
 */
export function TestimonialSection({
	heading,
	eyebrow,
	intro,
	testimonials,
	tone = "muted",
	width = "content",
	className,
}: TestimonialSectionProps) {
	if (testimonials.length === 0) {
		return null;
	}

	const multiple = testimonials.length > 1;
	const headingId = "testimonial-heading";

	return (
		<Section
			tone={tone}
			width={width}
			spacing="md"
			className={className}
			aria-labelledby={heading ? headingId : undefined}
		>
			<SectionHeader
				id={headingId}
				eyebrow={eyebrow}
				heading={heading}
				intro={intro}
				align="center"
				className="mb-10"
			/>
			<ul
				className={cn(
					"grid list-none gap-8",
					multiple ? "sm:grid-cols-2 lg:grid-cols-3" : "mx-auto max-w-prose",
				)}
			>
				{testimonials.map((testimonial) => (
					<li key={testimonial.quote}>
						<figure className="flex h-full flex-col gap-5 rounded-card bg-card p-8 shadow-card">
							<blockquote className="text-pretty text-lead text-foreground">
								&ldquo;{testimonial.quote}&rdquo;
							</blockquote>
							<figcaption className="mt-auto text-sm text-muted-foreground">
								<span className="font-medium text-foreground">{testimonial.author}</span>
								{testimonial.detail ? <span>, {testimonial.detail}</span> : null}
							</figcaption>
						</figure>
					</li>
				))}
			</ul>
		</Section>
	);
}
