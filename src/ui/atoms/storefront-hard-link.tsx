"use client";

import { type ReactNode, type MouseEvent } from "react";

type StorefrontHardLinkProps = {
	href: string;
	className?: string;
	children: ReactNode;
};

/**
 * Same-root storefront navigation that must bypass the App Router cache.
 * Plain `<a href>` inside a root layout is still client-navigated by Next.js;
 * auth routes (login after logout) can restore a cached “already signed in → home”
 * payload and feel like the link does nothing.
 */
export function StorefrontHardLink({ href, className, children }: StorefrontHardLinkProps) {
	return (
		<a
			href={href}
			className={className}
			onClick={(event: MouseEvent<HTMLAnchorElement>) => {
				event.preventDefault();
				window.location.assign(href);
			}}
		>
			{children}
		</a>
	);
}
