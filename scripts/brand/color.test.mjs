import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const script = fileURLToPath(new URL("./color.mjs", import.meta.url));
/** Run the CLI; returns trimmed stdout. Throws if the process exits non-zero. */
const run = (...args) => execFileSync("node", [script, ...args], { encoding: "utf8" }).trim();
const channels = (out) => out.split(" -> ")[1].split(" ").map(Number);

describe("reference-color helper CLI (hex -> OKLCH channels)", () => {
	it("converts the achromatic poles to neutral channels", () => {
		expect(run("#000000")).toBe("#000000 -> 0 0 0");
		const [l, c] = channels(run("#ffffff"));
		expect(l).toBeGreaterThan(0.99);
		expect(c).toBeLessThan(0.001);
	});

	it("converts a saturated brand blue to plausible OKLCH (mid L, real chroma, blue hue)", () => {
		const [l, c, h] = channels(run("#1466b3"));
		expect(l).toBeGreaterThan(0.4);
		expect(l).toBeLessThan(0.7);
		expect(c).toBeGreaterThan(0.1);
		expect(h).toBeGreaterThan(230);
		expect(h).toBeLessThan(275);
	});

	it("accepts multiple args and the hash-less form", () => {
		const lines = run("1466b3", "#f08c1d").split("\n");
		expect(lines).toHaveLength(2);
		expect(lines[0].startsWith("1466b3 -> ")).toBe(true);
	});

	it("exits non-zero on a non-hex arg", () => {
		expect(() => run("nope")).toThrow();
	});
});
