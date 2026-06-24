import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NavHrefLink } from "@/ui/atoms/nav-href-link";

export interface ArrowLinkProps {
	href: string;
	children: ReactNode;
	className?: string;
}

/**
 * Text link with a trailing arrow that slides on hover — the recurring
 * "secondary CTA" affordance for editorial/marketing surfaces. Server Component;
 * uses channel-aware routing for internal hrefs, plain anchors for external.
 */
export function ArrowLink({ href, children, className }: ArrowLinkProps) {
	const classes = cn(
		"group/arrow inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-foreground",
		"underline-offset-4 hover:underline",
		"focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		className,
	);

	const inner = (
		<>
			{children}
			<ArrowRight
				className="h-4 w-4 shrink-0 transition-transform duration-base ease-standard group-hover/arrow:translate-x-1 motion-reduce:transition-none"
				aria-hidden="true"
			/>
		</>
	);

	return (
		<NavHrefLink href={href} className={classes}>
			{inner}
		</NavHrefLink>
	);
}
