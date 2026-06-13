"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { isLocaleSlug, type LocaleSlug } from "@/config/locale";
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
		// Trust explicit locale from RSC (validated server-side) — use isLocaleSlug, not the
		// deployment allowlist, so client href matches SSR on checkout and other surfaces.
		const resolvedLocale: LocaleSlug =
			locale && isLocaleSlug(locale) ? locale : resolveBrowseLocaleSlugWithFallback(locale);

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
