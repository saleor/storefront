import { describe, expect, it } from "vitest";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import { mergeStorefrontContent } from "@/lib/content/merge";
import type { PartialStorefrontContent } from "@/lib/content/saleor/types";

describe("mergeStorefrontContent", () => {
	it("returns defaults when override is empty", () => {
		expect(mergeStorefrontContent(defaultStorefrontContent, {})).toEqual(defaultStorefrontContent);
	});

	it("merges chrome announcement fields without dropping defaults", () => {
		const override: PartialStorefrontContent = {
			chrome: {
				announcementBar: {
					message: "Summer sale — 20% off",
				},
			},
		};
		const merged = mergeStorefrontContent(defaultStorefrontContent, override);

		expect(merged.chrome.announcementBar.message).toBe("Summer sale — 20% off");
		expect(merged.chrome.announcementBar.id).toBe(defaultStorefrontContent.chrome.announcementBar.id);
	});

	it("replaces homepage paragraph arrays when provided", () => {
		const merged = mergeStorefrontContent(defaultStorefrontContent, {
			surfaces: {
				homepage: {
					brandStory: {
						paragraphs: ["Only this paragraph"],
					},
				},
			},
		});

		expect(merged.surfaces.homepage.brandStory.paragraphs).toEqual(["Only this paragraph"]);
	});

	it("keeps default paragraphs when override sends an empty array", () => {
		const merged = mergeStorefrontContent(defaultStorefrontContent, {
			surfaces: {
				homepage: {
					editorial: {
						paragraphs: [],
					},
				},
			},
		});

		expect(merged.surfaces.homepage.editorial.paragraphs).toEqual(
			defaultStorefrontContent.surfaces.homepage.editorial.paragraphs,
		);
	});
});
