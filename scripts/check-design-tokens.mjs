#!/usr/bin/env node
/**
 * Design-token guard (hard-fail gate).
 *
 * Fails if a UI component hardcodes a raw color (hex / rgb() / hsl()) instead of
 * using a design token from `src/styles/brand.css` (see the `ui-design-system` skill).
 * Tokens keep rebrands global and keep the fork surface small.
 *
 * Scope: src/ui/**\/*.tsx component styling only. Excluded by design:
 *   - `.ts` files — color *data* (swatch hex from catalog, color-name maps) is not styling
 *   - tests / __fixtures__ — sample data, not UI
 *   - brand.css and SEO/OG color config — they legitimately define raw colors elsewhere
 *
 * Escape hatch: add `design-tokens-allow` in a comment on the same line for the rare
 * legitimate case (e.g. a third-party hex passed through, dynamic swatch from data).
 *
 * Run: pnpm run lint:design-tokens   (also part of design-verification gates)
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const scanRoot = join(repoRoot, "src", "ui");

const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/;
const COLOR_FN = /\b(?:rgb|rgba|hsl|hsla)\(/;
const ALLOW = "design-tokens-allow";

const isExcluded = (full) => full.includes("__fixtures__") || /\.(test|spec|stories)\.tsx?$/.test(full);

/** @param {string} dir @returns {string[]} */
function walk(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			out.push(...walk(full));
		} else if (extname(full) === ".tsx" && !isExcluded(full)) {
			out.push(full);
		}
	}
	return out;
}

const violations = [];
for (const file of walk(scanRoot)) {
	const lines = readFileSync(file, "utf8").split("\n");
	lines.forEach((line, i) => {
		if (line.includes(ALLOW)) return;
		if (HEX.test(line) || COLOR_FN.test(line)) {
			violations.push(`${relative(repoRoot, file)}:${i + 1}  ${line.trim()}`);
		}
	});
}

if (violations.length > 0) {
	console.error(
		`\n✖ Raw color literal(s) found in src/ui — use a design token (brand.css) instead.\n` +
			`  See the ui-design-system skill. Add a "${ALLOW}" comment to allow a rare exception.\n`,
	);
	for (const v of violations) console.error(`  ${v}`);
	console.error(`\n${violations.length} violation(s).\n`);
	process.exit(1);
}

console.log("✓ design-tokens: no raw color literals in src/ui");
