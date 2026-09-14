import { describe, expect, it } from "vitest";
import { redactAnalyticsUrl } from "./redact-url";

describe("redactAnalyticsUrl", () => {
	it("drops the checkout id but keeps the shallow step", () => {
		expect(
			redactAnalyticsUrl("https://shop.example/checkout?checkout=Q2hlY2tvdXQ6MQ%3D%3D&step=shipping"),
		).toBe("https://shop.example/checkout?step=shipping");
	});

	it("replaces the guest order token path segment", () => {
		expect(redactAnalyticsUrl("https://shop.example/order/ov1.abc.def?locale=pl")).toBe(
			"https://shop.example/order/[key]?locale=pl",
		);
	});

	it("leaves the static /order/find page alone", () => {
		expect(redactAnalyticsUrl("https://shop.example/order/find")).toBe("https://shop.example/order/find");
	});

	it("drops Stripe return-trip params", () => {
		expect(
			redactAnalyticsUrl(
				"https://shop.example/checkout?checkout=abc&processingPayment=true&payment_intent=pi_1&payment_intent_client_secret=pi_1_secret_x&redirect_status=succeeded",
			),
		).toBe("https://shop.example/checkout?processingPayment=true");
	});

	it("drops account confirmation email + token", () => {
		expect(
			redactAnalyticsUrl("https://shop.example/en/default-channel/login?confirm=1&email=a%40b.c&token=t"),
		).toBe("https://shop.example/en/default-channel/login?confirm=1");
	});

	it("drops search terms", () => {
		expect(
			redactAnalyticsUrl("https://shop.example/en/default-channel/search?query=my+address&sort=price"),
		).toBe("https://shop.example/en/default-channel/search?sort=price");
	});

	it("drops any credential-looking param name and the fragment", () => {
		expect(redactAnalyticsUrl("https://shop.example/en/c/p?resetToken=x&sessionId=y&variant=blue#top")).toBe(
			"https://shop.example/en/c/p?variant=blue",
		);
	});

	it("keeps benign browse params untouched", () => {
		const url =
			"https://shop.example/en/default-channel/products?sort=price&direction=asc&cursor=abc&colors=red";
		expect(redactAnalyticsUrl(url)).toBe(url);
	});

	it("serializes cleanly when every param was dropped (no dangling '?')", () => {
		expect(redactAnalyticsUrl("https://shop.example/checkout?checkout=abc")).toBe(
			"https://shop.example/checkout",
		);
	});

	it("fails closed on a non-absolute URL", () => {
		expect(redactAnalyticsUrl("/checkout?checkout=abc#x")).toBe("/checkout");
	});
});
