import { describe, expect, it } from "vitest";
import {
	ANNOUNCEMENT_NO_FLASH_COOKIE_ATTR,
	ANNOUNCEMENT_NO_FLASH_KEY_ATTR,
	ANNOUNCEMENT_NO_FLASH_SCRIPT,
	isAnnouncementDismissed,
	resolveAnnouncementDismissKey,
} from "@/lib/content/announcement-dismiss-key";

describe("isAnnouncementDismissed", () => {
	const dismissKey = "paper:announcement-dismissed:id:test-campaign";

	it("returns false when cookie is absent", () => {
		expect(isAnnouncementDismissed(undefined, dismissKey)).toBe(false);
	});

	it("matches decoded cookie values", () => {
		expect(isAnnouncementDismissed(encodeURIComponent(dismissKey), dismissKey)).toBe(true);
	});

	it("returns false for a different dismiss key", () => {
		expect(isAnnouncementDismissed(dismissKey, "paper:announcement-dismissed:id:other")).toBe(false);
	});
});

describe("resolveAnnouncementDismissKey", () => {
	it("uses content hash when id is empty", () => {
		const key = resolveAnnouncementDismissKey({
			id: "",
			message: "Free shipping on orders over $75",
			href: null,
			linkLabel: null,
		});
		expect(key).toMatch(/^paper:announcement-dismissed:content:[a-z0-9]+$/);
	});

	it("changes hash when message changes", () => {
		const base = { id: "", href: null, linkLabel: null };
		const a = resolveAnnouncementDismissKey({ ...base, message: "Sale on now" });
		const b = resolveAnnouncementDismissKey({ ...base, message: "Summer sale" });
		expect(a).not.toBe(b);
	});

	it("uses explicit id override when set", () => {
		const key = resolveAnnouncementDismissKey({
			id: "summer-sale-2026",
			message: "Any message",
			href: null,
			linkLabel: null,
		});
		expect(key).toBe("paper:announcement-dismissed:id:summer-sale-2026");
	});

	it("ignores message for dismissal when explicit id is set", () => {
		const a = resolveAnnouncementDismissKey({
			id: "campaign-a",
			message: "Version one",
			href: null,
			linkLabel: null,
		});
		const b = resolveAnnouncementDismissKey({
			id: "campaign-a",
			message: "Version two",
			href: null,
			linkLabel: null,
		});
		expect(a).toBe(b);
	});

	it("includes href and linkLabel in content hash", () => {
		const base = { id: "", message: "Learn more", href: "/sale", linkLabel: null };
		const withLabel = resolveAnnouncementDismissKey({ ...base, linkLabel: "Shop sale" });
		const withoutLabel = resolveAnnouncementDismissKey(base);
		expect(withLabel).not.toBe(withoutLabel);
	});
});

describe("ANNOUNCEMENT_NO_FLASH_SCRIPT", () => {
	it("reads its inputs from data-* attributes, never from interpolated data", () => {
		// The script body must stay a static constant: per-request values arrive via
		// attributes read through document.currentScript, so there is no code construction
		// from (potentially CMS-controlled) data — and no </script> breakout surface.
		expect(ANNOUNCEMENT_NO_FLASH_SCRIPT).toContain("document.currentScript");
		expect(ANNOUNCEMENT_NO_FLASH_SCRIPT).toContain(ANNOUNCEMENT_NO_FLASH_COOKIE_ATTR);
		expect(ANNOUNCEMENT_NO_FLASH_SCRIPT).toContain(ANNOUNCEMENT_NO_FLASH_KEY_ATTR);
	});

	it("does not embed a concrete dismiss key", () => {
		expect(ANNOUNCEMENT_NO_FLASH_SCRIPT).not.toContain("paper:announcement-dismissed:");
	});
});
