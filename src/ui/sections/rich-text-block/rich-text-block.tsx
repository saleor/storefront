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
			className={cn("bg-background py-16 md:py-24 lg:py-28", className)}
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
					<h2 id="rich-text-heading" className="text-balance text-h2">
						{heading}
					</h2>
				) : null}
				{paragraphs.length > 0 ? (
					<div className={cn("space-y-5 text-pretty text-lead text-muted-foreground", heading && "mt-5")}>
						{paragraphs.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>
				) : null}
			</div>
		</section>
	);
}
