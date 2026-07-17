import type { ComponentProps, ReactNode } from "react";
import { isExternalMenuHref } from "@/lib/menus/menu-item-utils";
import { isSafeNavHref } from "@/lib/url/safe-href";
import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";

export interface NavHrefLinkProps extends Omit<ComponentProps<typeof LinkWithChannel>, "href"> {
	href: string;
	children: ReactNode;
}

/**
 * Channel-aware link for CMS/menu hrefs.
 * Renders a plain anchor for safe external/mailto URLs, `LinkWithChannel` for internal paths,
 * and non-interactive content when the href fails validation.
 */
export function NavHrefLink({ href, children, className, ...props }: NavHrefLinkProps) {
	if (!isSafeNavHref(href)) {
		return <span className={cn(className)}>{children}</span>;
	}

	if (isExternalMenuHref(href)) {
		return (
			<a href={href} rel="noopener noreferrer" className={className} {...props}>
				{children}
			</a>
		);
	}

	return (
		<LinkWithChannel href={href} className={className} {...props}>
			{children}
		</LinkWithChannel>
	);
}
