import { describe, expect, it } from "vitest";

import { clientIpFromHeaders, ipRateLimitKey } from "./client-ip";

const headers = (values: Record<string, string>) => new Headers(values);

describe("clientIpFromHeaders", () => {
	it("on Vercel, uses the address the platform sets", () => {
		expect(
			clientIpFromHeaders(headers({ "x-real-ip": "203.0.113.7", "x-forwarded-for": "198.51.100.1" }), {
				VERCEL: "1",
			}),
		).toBe("203.0.113.7");
	});

	it("follows an explicit proxy count even where VERCEL is set (e.g. pulled into .env.local)", () => {
		expect(
			clientIpFromHeaders(headers({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "1.1.1.1, 203.0.113.7" }), {
				VERCEL: "1",
				TRUSTED_PROXY_COUNT: "1",
			}),
		).toBe("203.0.113.7");
	});

	it("elsewhere, ignores entries the visitor added in front of the proxy's", () => {
		// The visitor sent "1.1.1.1"; the one trusted proxy appended the real address.
		const forwarded = headers({ "x-forwarded-for": "1.1.1.1, 203.0.113.7" });
		expect(clientIpFromHeaders(forwarded, {})).toBe("203.0.113.7");
		expect(clientIpFromHeaders(forwarded, { TRUSTED_PROXY_COUNT: "1" })).toBe("203.0.113.7");
	});

	it("counts back past every trusted proxy", () => {
		// Visitor → CDN (appends the visitor) → load balancer (appends the CDN) → Paper.
		const forwarded = headers({ "x-forwarded-for": "1.1.1.1, 203.0.113.7, 10.0.0.2" });
		expect(clientIpFromHeaders(forwarded, { TRUSTED_PROXY_COUNT: "2" })).toBe("203.0.113.7");
	});

	it("does not trust a visitor-supplied x-real-ip off Vercel", () => {
		expect(
			clientIpFromHeaders(headers({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "203.0.113.7" }), {}),
		).toBe("203.0.113.7");
	});

	it("treats anything that is not an IP address as unknown, so it cannot make up keys", () => {
		expect(clientIpFromHeaders(headers({}), {})).toBe("unknown");
		expect(clientIpFromHeaders(headers({ "x-forwarded-for": "x".repeat(500) }), {})).toBe("unknown");
		expect(clientIpFromHeaders(headers({ "x-real-ip": "not-an-ip" }), { VERCEL: "1" })).toBe("unknown");
	});

	it("groups IPv6 visitors by their /64", () => {
		expect(clientIpFromHeaders(headers({ "x-forwarded-for": "2001:db8:1:2:aaaa::1" }), {})).toBe(
			"2001:db8:1:2::/64",
		);
		expect(clientIpFromHeaders(headers({ "x-forwarded-for": "2001:db8:1:2:bbbb::9" }), {})).toBe(
			"2001:db8:1:2::/64",
		);
	});
});

describe("ipRateLimitKey", () => {
	it("keeps IPv4, and reads IPv4 written as IPv6 as IPv4", () => {
		expect(ipRateLimitKey("203.0.113.7")).toBe("203.0.113.7");
		expect(ipRateLimitKey("::ffff:203.0.113.7")).toBe("203.0.113.7");
		expect(ipRateLimitKey("::ffff:cb00:7107")).toBe("203.0.113.7");
	});

	it("writes every spelling of one IPv6 network the same way", () => {
		const key = "2001:db8:0:1::/64";
		expect(ipRateLimitKey("2001:db8::1:0:0:0:1")).toBe(key);
		expect(ipRateLimitKey("2001:0DB8:0000:0001:ffff:0:0:2")).toBe(key);
		expect(ipRateLimitKey("[2001:db8:0:1::3]")).toBe(key);
		expect(ipRateLimitKey("2001:db8:0:1::4%eth0")).toBe(key);
		expect(ipRateLimitKey("::1")).toBe("0:0:0:0::/64");
	});

	it("rejects what is not an address", () => {
		expect(ipRateLimitKey("")).toBeNull();
		expect(ipRateLimitKey("unknown")).toBeNull();
		expect(ipRateLimitKey("1.2.3")).toBeNull();
		expect(ipRateLimitKey("2001:db8::1::2")).toBeNull();
	});
});
