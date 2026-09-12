import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { webAnalyticsEnabled } from "./web-analytics";

const ENV_KEYS = ["NEXT_PUBLIC_VERCEL_WEB_ANALYTICS", "VERCEL"] as const;
const saved: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

beforeEach(() => {
	for (const key of ENV_KEYS) {
		saved[key] = process.env[key];
		delete process.env[key];
	}
});

afterEach(() => {
	for (const key of ENV_KEYS) {
		if (saved[key] === undefined) delete process.env[key];
		else process.env[key] = saved[key];
	}
	vi.restoreAllMocks();
});

describe("webAnalyticsEnabled", () => {
	it("is off outside Vercel when unset (script would 404 per page)", () => {
		expect(webAnalyticsEnabled()).toBe(false);
	});

	it("is on by default on Vercel", () => {
		process.env.VERCEL = "1";
		expect(webAnalyticsEnabled()).toBe(true);
	});

	it("explicit off wins on Vercel — the cost lever", () => {
		process.env.VERCEL = "1";
		process.env.NEXT_PUBLIC_VERCEL_WEB_ANALYTICS = "0";
		expect(webAnalyticsEnabled()).toBe(false);
	});

	it("explicit on wins off Vercel (self-hosted with a Vercel-compatible endpoint)", () => {
		process.env.NEXT_PUBLIC_VERCEL_WEB_ANALYTICS = "true";
		expect(webAnalyticsEnabled()).toBe(true);
	});

	it("a typo falls back to the platform default and warns instead of crashing", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		process.env.VERCEL = "1";
		process.env.NEXT_PUBLIC_VERCEL_WEB_ANALYTICS = "yes please";
		expect(webAnalyticsEnabled()).toBe(true);
		expect(warn).toHaveBeenCalledOnce();
	});
});
