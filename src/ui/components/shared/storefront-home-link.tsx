"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { resolveBrowseLocaleSlugWithFallback } from "@/lib/browse-locale";
import { buildStorefrontPath } from "@/lib/storefront-path";

type StorefrontHomeLinkProps = {
	locale?: string | null;
	channel?: string | null;
	className?: string;
	children: ReactNode;
};

/**
 * Returns to storefront home. Uses a plain anchor when `channel` is known so navigation
 * is a full document load — soft App Router links restore a stale header from Router Cache.
 */
export function StorefrontHomeLink({ locale, channel, className, children }: StorefrontHomeLinkProps) {
	if (channel) {
		const resolvedLocale = resolveBrowseLocaleSlugWithFallback(locale);
		return (
			<a href={buildStorefrontPath(resolvedLocale, channel)} className={className}>
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
