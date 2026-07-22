import { permanentRedirect } from "next/navigation";
import type { CatalogSlugKind } from "@/lib/catalog/catalog-identity";
import { pickTranslatedSlug } from "@/lib/saleor-translations";
import { buildStorefrontPath } from "@/lib/storefront-path";

export type { CatalogSlugKind };

type SluggedEntity = {
	slug: string;
	translation?: { slug?: string | null } | null;
};

/** Path suffix using the locale-canonical catalog slug (`translation.slug ?? slug`). */
export function catalogPathSuffix(kind: CatalogSlugKind, entity: SluggedEntity): string {
	return `/${kind}/${encodeURIComponent(pickTranslatedSlug(entity))}`;
}

function toQueryString(searchParams: Record<string, string | string[] | undefined> | undefined): string {
	if (!searchParams) return "";

	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(searchParams)) {
		if (value == null) continue;
		if (Array.isArray(value)) {
			for (const entry of value) {
				if (entry != null && entry !== "") params.append(key, entry);
			}
			continue;
		}
		if (value !== "") params.set(key, value);
	}

	const query = params.toString();
	return query ? `?${query}` : "";
}

/**
 * 308 to the locale-canonical slug when the URL still uses the primary (or stale) slug.
 * No-op when already canonical or when no translated slug is configured.
 *
 * Pass `searchParams` so deep links (`?variant=`, PLP filters) survive the redirect.
 */
export function redirectToCanonicalCatalogSlug(options: {
	locale: string;
	channel: string;
	urlSlug: string;
	kind: CatalogSlugKind;
	entity: SluggedEntity;
	searchParams?: Record<string, string | string[] | undefined>;
}): void {
	const canonical = pickTranslatedSlug(options.entity);
	if (decodeURIComponent(options.urlSlug) === canonical) return;

	const path = buildStorefrontPath(
		options.locale,
		options.channel,
		`/${options.kind}/${encodeURIComponent(canonical)}`,
	);

	permanentRedirect(`${path}${toQueryString(options.searchParams)}`);
}
