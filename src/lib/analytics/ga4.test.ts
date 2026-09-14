import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ga4Enabled, gaMeasurementId } from "./ga4";

const ENV_KEY = "NEXT_PUBLIC_GA_MEASUREMENT_ID";
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

describe("gaMeasurementId", () => {
	it("is off by default", () => {
		expect(gaMeasurementId()).toBeNull();
		expect(ga4Enabled()).toBe(false);
	});

	it("accepts a GA4 id", () => {
		expect(gaMeasurementId("G-ABC123XYZ")).toBe("G-ABC123XYZ");
	});

	it("rejects UA / GTM / junk and warns", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		expect(gaMeasurementId("UA-123-1")).toBeNull();
		expect(gaMeasurementId("GTM-XXXX")).toBeNull();
		expect(gaMeasurementId("not-an-id")).toBeNull();
		expect(warn).toHaveBeenCalledTimes(3);
	});
});
