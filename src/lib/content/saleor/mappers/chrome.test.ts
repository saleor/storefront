import { describe, expect, it } from "vitest";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import { mergeStorefrontContent } from "@/lib/content/merge";
import { mapChromePage } from "@/lib/content/saleor/mappers/chrome";
import type { StorefrontContentPageFragment } from "@/gql/graphql";

describe("mapChromePage", () => {
	it("keeps default announcement id when Saleor only sets message", () => {
		const page: StorefrontContentPageFragment = {
			slug: "storefront-chrome",
			isPublished: true,
			pageType: { slug: "storefront-chrome" },
			assignedAttributes: [{ attribute: { slug: "announcement-message" }, plainText: "Sale on now" }],
		};

		const merged = mergeStorefrontContent(defaultStorefrontContent, mapChromePage(page));

		expect(merged.chrome.announcementBar.message).toBe("Sale on now");
		expect(merged.chrome.announcementBar.id).toBe(defaultStorefrontContent.chrome.announcementBar.id);
	});
});
