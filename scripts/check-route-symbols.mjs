#!/usr/bin/env node
/**
 * Assert Partial Prerender symbols for the storefront routes that must stay ◐.
 *
 *   pnpm build:check
 *   node scripts/check-route-symbols.mjs build-output.txt
 *
 * A listing or product route that flips to ƒ is reading the request in the page shell.
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const REQUIRED = [
	"/[locale]/[channel]/products",
	"/[locale]/[channel]/categories/[slug]",
	"/[locale]/[channel]/collections/[slug]",
	"/[locale]/[channel]/search",
	"/[locale]/[channel]/products/[slug]",
];

function buildLog() {
	const file = process.argv[2];
	if (file) return readFileSync(file, "utf8");
	const result = spawnSync("pnpm", ["run", "build"], { encoding: "utf8" });
	const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
	if (result.status !== 0) {
		console.error(output);
		process.exit(result.status ?? 1);
	}
	return output;
}

const log = buildLog();
const missing = [];
for (const route of REQUIRED) {
	const line = log.split("\n").find((entry) => {
		if (!entry.includes(route)) return false;
		if (route.endsWith("/products") && entry.includes(`${route}/`)) return false;
		return /[◐ƒ○]/.test(entry);
	});
	if (!line) {
		missing.push(`${route} was not in the build output`);
		continue;
	}
	if (!line.includes("◐")) {
		missing.push(`${route} is not partial (◐):\n${line.trim()}`);
	}
}

if (missing.length > 0) {
	console.error(missing.join("\n"));
	process.exit(1);
}
console.log(`Route symbols: ${REQUIRED.length} listing/product routes are ◐.`);
