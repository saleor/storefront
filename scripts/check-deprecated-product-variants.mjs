#!/usr/bin/env node
/**
 * Forbid the deprecated unpaginated `Product.variants` field in storefront GraphQL.
 *
 * Saleor deprecates `Product.variants` in favor of the paginated `productVariants`
 * connection (cap 100 per page). Using the list field loads *all* variants and has
 * caused multi-second PDP payloads on high-cardinality catalogs.
 *
 * Scope: `src/graphql/**\/*.graphql` only (storefront documents).
 * Escape hatch: add `allow-deprecated-product-variants` on the same line.
 *
 * Run: pnpm run lint:graphql-variants   (also part of `pnpm run verify`)
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const scanRoot = join(repoRoot, "src", "graphql");

/** Matches the deprecated Product.variants selection set opener (not `productVariants`). */
const DEPRECATED_VARIANTS = /(?<![\w])variants\s*\{/;
const ALLOW = "allow-deprecated-product-variants";

function walk(dir) {
	/** @type {string[]} */
	const files = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		const st = statSync(full);
		if (st.isDirectory()) files.push(...walk(full));
		else if (extname(full) === ".graphql") files.push(full);
	}
	return files;
}

/** @type {{ file: string; line: number; text: string }[]} */
const violations = [];

for (const file of walk(scanRoot)) {
	const lines = readFileSync(file, "utf8").split(/\r?\n/);
	lines.forEach((text, index) => {
		if (!DEPRECATED_VARIANTS.test(text)) return;
		if (text.includes(ALLOW)) return;
		violations.push({
			file: relative(repoRoot, file),
			line: index + 1,
			text: text.trim(),
		});
	});
}

if (violations.length > 0) {
	console.error(
		"Deprecated Product.variants { … } found in storefront GraphQL.\n" +
			"Use productVariants(first:) (paginated connection) instead.\n" +
			`Escape hatch: ${ALLOW} on the same line.\n`,
	);
	for (const v of violations) {
		console.error(`  ${v.file}:${v.line}: ${v.text}`);
	}
	process.exit(1);
}

console.log("lint:graphql-variants — ok (no deprecated Product.variants selections)");
