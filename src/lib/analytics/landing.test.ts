import { describe, expect, it } from "vitest";
import { captureLandingSnapshot, landingPathFromHref, parseLandingSnapshot } from "./landing";

const now = new Date("2026-09-12T12:00:00.000Z");

describe("captureLandingSnapshot", () => {
	it("copies UTM fields and redacts the landing path", () => {
		expect(
			captureLandingSnapshot(
				"https://shop.example/en/us/products/shirt?utm_source=google&utm_medium=cpc&utm_campaign=summer&checkout=Q2hlY2tvdXQ6MQ==",
				now,
			),
		).toEqual({
			capturedAt: "2026-09-12T12:00:00.000Z",
			landingPath: "/en/us/products/shirt",
			source: "google",
			medium: "cpc",
			campaign: "summer",
		});
	});

	it("strips utm_* from landingPath so they are not duplicated", () => {
		expect(landingPathFromHref("https://shop.example/en/us?utm_source=google&sort=price")).toBe(
			"/en/us?sort=price",
		);
	});

	it("replaces the guest order token so it cannot land in Pulse or GA", () => {
		expect(landingPathFromHref("https://shop.example/order/ov1.abc.def?locale=pl")).toBe(
			"/order/[key]?locale=pl",
		);
	});

	it("drops the query when the path would overflow the cookie budget", () => {
		expect(landingPathFromHref(`https://shop.example/en/us/products?colors=${"a".repeat(500)}`)).toBe(
			"/en/us/products",
		);
	});

	it("drops checkout id and search text from the path", () => {
		expect(
			captureLandingSnapshot("https://shop.example/checkout?checkout=abc&step=shipping&query=secret", now)
				.landingPath,
		).toBe("/checkout?step=shipping");
	});

	it("does not store a referrer or click id", () => {
		const snapshot = captureLandingSnapshot(
			"https://shop.example/en/us?gclid=abc&fbclid=xyz&utm_source=google",
			now,
		);
		expect(snapshot).toEqual({
			capturedAt: "2026-09-12T12:00:00.000Z",
			landingPath: "/en/us",
			source: "google",
		});
		expect(JSON.stringify(snapshot)).not.toMatch(/gclid|fbclid|referrer/i);
	});

	it("caps and drops control characters in UTM values", () => {
		const long = "x".repeat(250);
		const snapshot = captureLandingSnapshot(
			`https://shop.example/en/us?utm_source=${long}&utm_medium=cpc%0D%0Aevil`,
			now,
		);
		expect(snapshot.source).toHaveLength(200);
		expect(snapshot.medium).toBeUndefined();
	});
});

describe("parseLandingSnapshot", () => {
	it("rejects junk, absolute URLs, and protocol-relative paths", () => {
		expect(parseLandingSnapshot("nope")).toBeNull();
		expect(parseLandingSnapshot(JSON.stringify({ capturedAt: "t", landingPath: "https://evil" }))).toBeNull();
		expect(
			parseLandingSnapshot(JSON.stringify({ capturedAt: "t", landingPath: "//evil.example" })),
		).toBeNull();
	});

	it("round-trips a valid snapshot", () => {
		const original = captureLandingSnapshot(
			"https://shop.example/en/us?utm_source=newsletter&utm_medium=email",
			now,
		);
		expect(parseLandingSnapshot(JSON.stringify(original))).toEqual(original);
	});
});
