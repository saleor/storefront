import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
	analyzeEntries,
	classify,
	isSaleorMedia,
	isStaticLeftoverPath,
	rscDestination,
} from "./analyze-storefront-har.mjs";

const script = fileURLToPath(new URL("./analyze-storefront-har.mjs", import.meta.url));
const fixture = fileURLToPath(new URL("./analyze-storefront-har.fixture.json", import.meta.url));

describe("analyze-storefront-har classify", () => {
	it("buckets Saleor thumbnail 302s as saleor-cdn, not HTML", () => {
		expect(
			classify({
				host: "example.saleor.cloud",
				pathname: "/thumbnail/abc/2048/webp/",
				search: "",
				mime: "text/html",
			}),
		).toBe("saleor-cdn");
		expect(isSaleorMedia("example.media.saleor.cloud", "/thumbnails/1/512/webp/")).toBe(true);
	});

	it("does not treat a 403 webmanifest as the Cloudflare challenge page", () => {
		expect(isStaticLeftoverPath("/site.webmanifest")).toBe(true);
		expect(isStaticLeftoverPath("/en/default-channel")).toBe(false);
	});

	it("prints RSC destinations with real query keys, minus _rsc", () => {
		const url = new URL("https://shop.example.com/en/default-channel/products?colors=blue&_rsc=1");
		expect(rscDestination(url)).toBe("/en/default-channel/products?colors=blue");
	});
});

describe("analyze-storefront-har fixture", () => {
	it("does not flag Saleor 302s or leftover 403s as document problems", () => {
		const har = JSON.parse(readFileSync(fixture, "utf8"));
		const { buckets, flags } = analyzeEntries(har.log.entries);

		expect(buckets.get("saleor-cdn")?.count).toBe(2);
		expect(buckets.get("html")?.count).toBe(1);
		expect(flags.some((f) => f.startsWith("HTML redirect"))).toBe(false);
		expect(flags.some((f) => f.includes("this HAR may be the challenge page"))).toBe(false);
	});

	it("prints a bucket table from the CLI", () => {
		const out = execFileSync("node", [script, fixture], { encoding: "utf8" });
		expect(out).toContain("saleor-cdn");
		expect(out).toContain("next-image");
		expect(out).not.toContain("HTML redirect");
		expect(out).not.toContain("this HAR may be the challenge page");
	});
});
