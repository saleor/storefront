import type { StorefrontContentPageFragment } from "@/gql/graphql";

export type AttributeMap = Map<string, string | boolean>;

export function buildAttributeMap(page: StorefrontContentPageFragment | null | undefined): AttributeMap {
	const map: AttributeMap = new Map();
	if (!page?.isPublished) return map;

	for (const assigned of page.assignedAttributes) {
		const slug = assigned.attribute.slug;
		if ("plainText" in assigned && assigned.plainText != null) {
			map.set(slug, assigned.plainText);
		} else if ("boolean" in assigned && assigned.boolean != null) {
			map.set(slug, assigned.boolean);
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

export function attrInt(map: AttributeMap, slug: string): number | undefined {
	const text = attrText(map, slug);
	if (!text) return undefined;
	const parsed = Number.parseInt(text, 10);
	return Number.isFinite(parsed) ? parsed : undefined;
}

export function attrOptionalUrl(map: AttributeMap, slug: string): string | null {
	const text = attrText(map, slug);
	return text ?? null;
}
