import { cn } from "@/lib/utils";
import { ArrowLink } from "@/ui/components/ui/arrow-link";
import { Section, type SectionTone } from "@/ui/sections/section";

export type RichTextAlign = "left" | "center";
export type RichTextWidth = "narrow" | "default" | "wide";

export interface RichTextBlockCta {
	label: string;
	href: string;
}

export interface RichTextBlockProps {
	heading?: string;
	eyebrow?: string;
	paragraphs: readonly string[];
	align?: RichTextAlign;
	width?: RichTextWidth;
	tone?: SectionTone;
	cta?: RichTextBlockCta;
	className?: string;
}

const innerWidthClassName: Record<RichTextWidth, string> = {
	narrow: "max-w-2xl",
	default: "max-w-3xl",
	wide: "max-w-4xl",
};

export function RichTextBlock({
	heading,
	eyebrow,
	paragraphs,
	align = "left",
	width = "default",
	tone = "default",
	cta,
	className,
}: RichTextBlockProps) {
	if (paragraphs.length === 0 && !heading) {
		return null;
	}

	const headingId = "rich-text-heading";
	const isCenter = align === "center";
	const isInverse = tone === "inverse";

	return (
		<Section tone={tone} bleed className={className} aria-labelledby={heading ? headingId : undefined}>
			<div
				className={cn("mx-auto px-4 sm:px-6 lg:px-8", innerWidthClassName[width], isCenter && "text-center")}
			>
				{eyebrow ? (
					<p
						className={cn(
							"text-eyebrow uppercase",
							isInverse ? "text-inverse-muted" : "text-muted-foreground",
						)}
					>
						{eyebrow}
					</p>
				) : null}
				{heading ? (
					<h2 id={headingId} className={cn("text-balance text-h2", eyebrow && "mt-3")}>
						{heading}
					</h2>
				) : null}
				{paragraphs.length > 0 ? (
					<div
						className={cn(
							"space-y-5 text-pretty text-lead",
							isInverse ? "text-inverse-subtle" : "text-muted-foreground",
							(heading || eyebrow) && "mt-5",
						)}
					>
						{paragraphs.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>
				) : null}
				{cta ? (
					<div className={cn("mt-8", isCenter && "flex justify-center")}>
						<ArrowLink href={cta.href}>{cta.label}</ArrowLink>
					</div>
				) : null}
			</div>
		</Section>
	);
}
