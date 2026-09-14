import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { analyticsConsentMode, analyticsStorageAllowed, resolveOriginConsent } from "./consent";

const ENV_KEY = "NEXT_PUBLIC_ANALYTICS_CONSENT_MODE";
let saved: string | undefined;

beforeEach(() => {
	saved = process.env[ENV_KEY];
	delete process.env[ENV_KEY];
});

afterEach(() => {
	if (saved === undefined) delete process.env[ENV_KEY];
	else process.env[ENV_KEY] = saved;
	vi.restoreAllMocks();
});

describe("analyticsConsentMode", () => {
	it("defaults to required — Paper ships no banner", () => {
		expect(analyticsConsentMode()).toBe("required");
	});

	it("accepts implied", () => {
		expect(analyticsConsentMode("implied")).toBe("implied");
	});

	it("treats a typo as required and warns", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		expect(analyticsConsentMode("opt-in")).toBe("required");
		expect(warn).toHaveBeenCalledOnce();
	});
});

describe("analyticsStorageAllowed", () => {
	it("is off under required until the shopper grants", () => {
		expect(analyticsStorageAllowed(null, "required")).toBe(false);
		expect(analyticsStorageAllowed("denied", "required")).toBe(false);
		expect(analyticsStorageAllowed("granted", "required")).toBe(true);
	});

	it("is on under implied unless the shopper denied", () => {
		expect(analyticsStorageAllowed(null, "implied")).toBe(true);
		expect(analyticsStorageAllowed("granted", "implied")).toBe(true);
		expect(analyticsStorageAllowed("denied", "implied")).toBe(false);
	});
});

describe("resolveOriginConsent", () => {
	it("maps the Pulse origin.consent enum", () => {
		expect(resolveOriginConsent("granted", "required")).toBe("granted");
		expect(resolveOriginConsent("denied", "required")).toBe("denied");
		expect(resolveOriginConsent(null, "required")).toBe("unknown");
		expect(resolveOriginConsent(null, "implied")).toBe("not_required");
		expect(resolveOriginConsent("denied", "implied")).toBe("denied");
	});
});
