import { describe, expect, it } from "vitest";
import { pageViewClaimKey } from "./browser";

describe("pageViewClaimKey", () => {
	it("does not put a guest order token in sessionStorage", () => {
		expect(pageViewClaimKey("https://shop.example/order/ov1.abc.secret")).toBe(
			"paper.analytics.page_view:/order/[key]",
		);
	});

	it("drops checkout id from the claim key", () => {
		expect(pageViewClaimKey("https://shop.example/en/us/checkout?checkout=Q2hlY2tvdXQ6MQ==")).toBe(
			"paper.analytics.page_view:/en/us/checkout",
		);
	});
});
