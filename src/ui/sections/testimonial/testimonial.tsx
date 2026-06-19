import { cn } from "@/lib/utils";

export interface TestimonialItem {
	quote: string;
	author: string;
	/** Role, location, or other attribution detail. */
	detail?: string;
}

export interface TestimonialSectionProps {
	heading?: string;
	testimonials: readonly TestimonialItem[];
	className?: string;
}

/**
 * Social-proof band: one centered quote, or a 2–3 column grid of quote cards.
 * Server Component, token-driven. Copy comes from the content layer / props.
 */
export function TestimonialSection({ heading, testimonials, className }: TestimonialSectionProps) {
	if (testimonials.length === 0) {
		return null;
	}

	const multiple = testimonials.length > 1;

	return (
		<section
			className={cn("bg-muted py-section-md", className)}
			aria-labelledby={heading ? "testimonial-heading" : undefined}
		>
			<div className="container-content">
				{heading ? (
					<h2 id="testimonial-heading" className="mb-10 text-balance text-center text-h2">
						{heading}
					</h2>
				) : null}
				<ul
					className={cn(
						"grid list-none gap-8",
						multiple ? "sm:grid-cols-2 lg:grid-cols-3" : "mx-auto max-w-prose",
					)}
				>
					{testimonials.map((testimonial) => (
						<li key={testimonial.quote}>
							<figure className="flex h-full flex-col gap-5 rounded-xl bg-card p-8 shadow-card">
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
			</div>
		</section>
	);
}
