import type { StorefrontContentPageFragment } from "@/gql/graphql";

export type AttributeMap = Map<string, string | number | boolean>;

export function buildAttributeMap(page: StorefrontContentPageFragment | null | undefined): AttributeMap {
	const map: AttributeMap = new Map();
	if (!page?.isPublished) return map;

	for (const assigned of page.assignedAttributes) {
		const slug = assigned.attribute.slug;
		if ("plainText" in assigned && assigned.plainText != null) {
			const translated =
				"plainTextTranslation" in assigned && typeof assigned.plainTextTranslation === "string"
					? assigned.plainTextTranslation.trim()
					: "";
			map.set(slug, translated.length > 0 ? translated : assigned.plainText);
		} else if ("boolean" in assigned && assigned.boolean != null) {
			map.set(slug, assigned.boolean);
		} else if ("numeric" in assigned && assigned.numeric != null) {
			map.set(slug, assigned.numeric);
		}
	}

	return map;
}

export function attrText(map: AttributeMap, slug: string): string | undefined {
	const value = map.get(slug);
	return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function attrBool(map: AttributeMap, slug: string): boolean | undefined {
	const value = map.get(slug);
	return typeof value === "boolean" ? value : undefined;
}

/**
 * Read a `NUMERIC` attribute (preferred) or a numeric `PLAIN_TEXT` fallback.
 * Returns `undefined` when unset or non-numeric so merge keeps the code default.
 */
export function attrNumber(map: AttributeMap, slug: string): number | undefined {
	const value = map.get(slug);
	if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
	if (typeof value === "string" && value.length > 0) {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : undefined;
	}
	return undefined;
}

export function attrInt(map: AttributeMap, slug: string): number | undefined {
	const value = attrNumber(map, slug);
	return value === undefined ? undefined : Math.trunc(value);
}

export function attrOptionalUrl(map: AttributeMap, slug: string): string | null {
	const text = attrText(map, slug);
	return text ?? null;
}

/** FILE attribute (AssignedFileAttribute). */
export function attrFileUrl(
	page: StorefrontContentPageFragment | null | undefined,
	attributeSlug: string,
): string | undefined {
	if (!page?.isPublished) return undefined;

	for (const assigned of page.assignedAttributes) {
		if (assigned.attribute.slug !== attributeSlug) continue;
		if ("file" in assigned && assigned.file?.url) {
			return assigned.file.url;
		}
	}

	return undefined;
}

/** Single collection reference attribute (AssignedSingleCollectionReferenceAttribute). */
export function attrCollectionSlug(
	page: StorefrontContentPageFragment | null | undefined,
	attributeSlug: string,
): string | undefined {
	if (!page?.isPublished) return undefined;

	for (const assigned of page.assignedAttributes) {
		if (assigned.attribute.slug !== attributeSlug) continue;
		if ("collection" in assigned && assigned.collection?.slug) {
			return assigned.collection.slug;
		}
	}

	return undefined;
}
