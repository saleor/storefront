import { STOREFRONT_PAGE_TYPES } from "@/lib/content/constants";
import { STOREFRONT_CHROME_ATTRIBUTES as A } from "@/lib/content/attribute-slugs";
import type { StorefrontContentPageFragment } from "@/gql/graphql";
import type { PartialStorefrontContent } from "@/lib/content/saleor/types";
import { attrBool, attrOptionalUrl, attrText, buildAttributeMap } from "@/lib/content/saleor/attributes";
import { omitEmpty } from "@/lib/content/saleor/omit-empty";

function attrOptionalText(map: ReturnType<typeof buildAttributeMap>, slug: string): string | null {
	return attrText(map, slug) ?? null;
}

export function mapChromePage(page: StorefrontContentPageFragment | null): PartialStorefrontContent {
	if (!page || page.pageType.slug !== STOREFRONT_PAGE_TYPES.chrome) return {};

	const attrs = buildAttributeMap(page);
	const message = attrText(attrs, A.announcementMessage);
	if (!message) return {};

	const announcementBar = {
		...omitEmpty({ id: attrText(attrs, A.announcementId) }),
		message,
		href: attrOptionalUrl(attrs, A.announcementHref),
		linkLabel: attrOptionalText(attrs, A.announcementLinkLabel),
		...(attrBool(attrs, A.announcementDismissible) !== undefined
			? { dismissible: attrBool(attrs, A.announcementDismissible) }
			: {}),
	};

	return { chrome: { announcementBar } };
}
