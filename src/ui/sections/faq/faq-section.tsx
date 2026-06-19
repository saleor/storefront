import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
	question: string;
	answer: string;
}

export interface FaqSectionProps {
	heading?: string;
	items: readonly FaqItem[];
	className?: string;
}

/**
 * FAQ accordion built on native `<details>` — a Server Component with zero client JS,
 * keyboard-accessible and SEO-friendly by default. Constrained to a readable measure.
 */
export function FaqSection({ heading, items, className }: FaqSectionProps) {
	if (items.length === 0) {
		return null;
	}

	return (
		<section
			className={cn("bg-background py-section-md", className)}
			aria-labelledby={heading ? "faq-heading" : undefined}
		>
			<div className="container-prose">
				{heading ? (
					<h2 id="faq-heading" className="mb-10 text-balance text-center text-h2">
						{heading}
					</h2>
				) : null}
				<div className="divide-y divide-border border-y border-border">
					{items.map((item) => (
						<details key={item.question} className="group py-2">
							<summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-h3 [&::-webkit-details-marker]:hidden">
								<span className="text-balance">{item.question}</span>
								<ChevronDown
									className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-base ease-standard group-open:rotate-180 motion-reduce:transition-none"
									aria-hidden="true"
								/>
							</summary>
							<p className="text-pretty pb-4 text-muted-foreground">{item.answer}</p>
						</details>
					))}
				</div>
			</div>
		</section>
	);
}
