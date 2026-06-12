import { cn } from "@/lib/utils";

export type RichTextAlign = "left" | "center";
export type RichTextWidth = "narrow" | "default" | "wide";

export interface RichTextBlockProps {
	heading?: string;
	paragraphs: readonly string[];
	align?: RichTextAlign;
	width?: RichTextWidth;
	className?: string;
}

const widthClassName: Record<RichTextWidth, string> = {
	narrow: "max-w-2xl",
	default: "max-w-3xl",
	wide: "max-w-4xl",
};

export function RichTextBlock({
	heading,
	paragraphs,
	align = "left",
	width = "default",
	className,
}: RichTextBlockProps) {
	if (paragraphs.length === 0 && !heading) {
		return null;
	}

	return (
		<section
			className={cn("border-b border-border bg-background py-12 md:py-16", className)}
			aria-labelledby={heading ? "rich-text-heading" : undefined}
		>
			<div
				className={cn(
					"mx-auto px-4 sm:px-6 lg:px-8",
					widthClassName[width],
					align === "center" && "text-center",
				)}
			>
				{heading ? (
					<h2 id="rich-text-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
						{heading}
					</h2>
				) : null}
				{paragraphs.length > 0 ? (
					<div className={cn("space-y-4 text-base text-muted-foreground md:text-lg", heading && "mt-4")}>
						{paragraphs.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>
				) : null}
			</div>
		</section>
	);
}
