import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionTone = "default" | "muted" | "inverse";
export type SectionWidth = "prose" | "content" | "wide" | "super-wide" | "full";
export type SectionSpacing = "none" | "sm" | "md" | "lg";

const toneClassName: Record<SectionTone, string> = {
	default: "bg-background text-foreground",
	muted: "bg-muted text-foreground",
	inverse: "bg-foreground text-inverse",
};

const widthClassName: Record<SectionWidth, string> = {
	prose: "container-prose",
	content: "container-content",
	wide: "container-wide",
	"super-wide": "container-super-wide",
	full: "container-full",
};

const spacingClassName: Record<SectionSpacing, string> = {
	none: "",
	sm: "py-section-sm",
	md: "py-section-md",
	lg: "py-section-lg",
};

export interface SectionProps {
	/** Band background + base text color. Use to alternate white / grey / dark bands. */
	tone?: SectionTone;
	/** Inner container width token. Ignored when `bleed` is set. */
	width?: SectionWidth;
	/** Vertical rhythm (fluid section tokens). */
	spacing?: SectionSpacing;
	/** When true, children span the full band with no inner width container. */
	bleed?: boolean;
	"aria-labelledby"?: string;
	"aria-label"?: string;
	className?: string;
	containerClassName?: string;
	children: ReactNode;
}

/**
 * Full-bleed band primitive: owns tone (background), vertical rhythm, and inner
 * width container so every marketing section composes consistently. Pair the
 * heading with `SectionHeader` (unique id → `aria-labelledby`). Server Component.
 */
export function Section({
	tone = "default",
	width = "content",
	spacing = "lg",
	bleed = false,
	className,
	containerClassName,
	children,
	...aria
}: SectionProps) {
	return (
		<section className={cn(toneClassName[tone], spacingClassName[spacing], className)} {...aria}>
			{bleed ? children : <div className={cn(widthClassName[width], containerClassName)}>{children}</div>}
		</section>
	);
}
