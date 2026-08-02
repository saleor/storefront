import { describe, expect, it } from "vitest";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import type { StorefrontContent } from "@/lib/content/types";
import { buildAnnouncementBarContent } from "@/lib/content/get-announcement-bar-props";

const baseContent: StorefrontContent = {
	...defaultStorefrontContent,
	chrome: {
		...defaultStorefrontContent.chrome,
		announcementBar: {
			id: "summer-sale",
			message: "Free shipping on orders over {freeShippingThreshold}",
			href: "/collections/sale",
			linkLabel: "Shop sale",
			dismissible: true,
		},
	},
};

describe("buildAnnouncementBarContent", () => {
	it("interpolates policy tokens into the announcement message", () => {
		const props = buildAnnouncementBarContent(baseContent, {
			currency: "USD",
			localeSlug: "en",
		});

		expect(props.message).toBe("Free shipping on orders over $75.00");
		expect(props.id).toBe("summer-sale");
		expect(props.href).toBe("/collections/sale");
		expect(props.dismissible).toBe(true);
	});

	it("formats the threshold for the browse locale", () => {
		const props = buildAnnouncementBarContent(baseContent, {
			currency: "USD",
			localeSlug: "pl",
		});

		expect(props.linkLabel).toBe("Shop sale");
		expect(props.message).toContain("75");
		expect(props.message).not.toContain("{freeShippingThreshold}");
	});
});
