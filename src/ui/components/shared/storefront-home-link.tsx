"use client";

import Link from "next/link";
import { type ReactNode } from "react";

type StorefrontHomeLinkProps = {
	channel?: string | null;
	className?: string;
	children: ReactNode;
};

/**
 * Returns to storefront home. Uses a plain anchor when `channel` is known so navigation
 * is a full document load — soft App Router links restore a stale header from Router Cache.
 */
export function StorefrontHomeLink({ channel, className, children }: StorefrontHomeLinkProps) {
	if (channel) {
		return (
			<a href={`/${channel}`} className={className}>
				{children}
			</a>
		);
	}

	return (
		<Link href="/" className={className}>
			{children}
		</Link>
	);
}
