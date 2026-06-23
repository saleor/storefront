import { describe, expect, it } from "vitest";
import { parsePhotoCredits, serializePhotoCredits } from "@/lib/content/photo-credits";
import { isSafeExternalHref } from "@/lib/url/safe-href";

describe("photo-credits", () => {
	it("round-trips structured credits", () => {
		const credits = [
			{ name: "Artist One", href: "https://example.com/one" },
			{ name: "Artist Two", href: "https://example.com/two" },
		];

		expect(parsePhotoCredits(serializePhotoCredits(credits))).toEqual(credits);
	});

	it("returns undefined for invalid JSON", () => {
		expect(parsePhotoCredits("not json")).toBeUndefined();
	});

	it("drops credits with unsafe href schemes", () => {
		expect(
			parsePhotoCredits(
				'[{"name":"Safe","href":"https://example.com"},{"name":"XSS","href":"javascript:alert(1)"}]',
			),
		).toEqual([{ name: "Safe", href: "https://example.com" }]);
	});

	it("drops credits with empty names", () => {
		expect(parsePhotoCredits('[{"name":"  ","href":"https://example.com"}]')).toBeUndefined();
	});

	it("accepts http and https URLs only", () => {
		expect(isSafeExternalHref("https://unsplash.com/@user")).toBe(true);
		expect(isSafeExternalHref("http://example.com")).toBe(true);
		expect(isSafeExternalHref("javascript:alert(1)")).toBe(false);
		expect(isSafeExternalHref("data:text/html,evil")).toBe(false);
		expect(isSafeExternalHref("/relative")).toBe(false);
	});
});
