import { describe, expect, it } from "vitest";
import { parseConsentChoice, parseLandingCookie } from "./cookies";

describe("parseConsentChoice", () => {
	it("accepts the two stored values", () => {
		expect(parseConsentChoice("granted")).toBe("granted");
		expect(parseConsentChoice("denied")).toBe("denied");
		expect(parseConsentChoice("unknown")).toBeNull();
		expect(parseConsentChoice("")).toBeNull();
	});
});

describe("parseLandingCookie", () => {
	it("decodes a URI-encoded snapshot", () => {
		const json = JSON.stringify({
			capturedAt: "2026-09-12T12:00:00.000Z",
			landingPath: "/en/us",
			source: "google",
		});
		expect(parseLandingCookie(encodeURIComponent(json))).toEqual({
			capturedAt: "2026-09-12T12:00:00.000Z",
			landingPath: "/en/us",
			source: "google",
		});
	});
});
