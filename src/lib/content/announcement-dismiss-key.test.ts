import { describe, expect, it } from "vitest";
import { resolveAnnouncementDismissKey } from "@/lib/content/announcement-dismiss-key";

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
