import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { isExternalMenuHref } from "@/lib/menus/menu-item-utils";
import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";

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

	if (isExternalMenuHref(href)) {
		return (
			<a href={href} rel="noopener noreferrer" className={classes}>
				{inner}
			</a>
		);
	}

	return (
		<LinkWithChannel href={href} prefetch={false} className={classes}>
			{inner}
		</LinkWithChannel>
	);
}
