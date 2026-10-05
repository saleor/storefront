#!/usr/bin/env node
/**
 * Hash of Paper-owned data-layer files.
 *
 *   pnpm core:lock           rewrite paper-core.lock.json
 *   pnpm core:lock --check   fail unless drift is declared in paper-version.json coreOverrides
 *
 * Forks that must edit a core file add `{ "path", "reason" }` under coreOverrides.
 * A later Paper upgrade can then port just those files.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "paper-core.lock.json");

const ROOTS = [
	join(ROOT, "src/lib/saleor"),
	join(ROOT, "src/lib/storefront"),
	join(ROOT, "src/lib/listing"),
	join(ROOT, "src/app/api/revalidate/route.ts"),
	join(ROOT, "src/app/api/cache-info/route.ts"),
];

function isCoreFile(file) {
	const rel = relative(ROOT, file).replaceAll("\\", "/");
	if (rel.startsWith("src/lib/listing/providers/") && !rel.startsWith("src/lib/listing/providers/saleor/")) {
		return false;
	}
	return true;
}

function filesUnder(path, acc = []) {
	try {
		const stat = readdirSync(path, { withFileTypes: true });
		for (const entry of stat) {
			const next = join(path, entry.name);
			if (entry.isDirectory()) filesUnder(next, acc);
			else if (!entry.name.endsWith(".test.ts")) acc.push(next);
		}
	} catch {
		acc.push(path);
	}
	return acc;
}

function hashes() {
	const out = {};
	for (const root of ROOTS) {
		for (const file of filesUnder(root)) {
			if (!isCoreFile(file)) continue;
			const rel = relative(ROOT, file);
			out[rel] = createHash("sha256").update(readFileSync(file)).digest("hex");
		}
	}
	return out;
}

function overrides() {
	const version = JSON.parse(readFileSync(join(ROOT, "paper-version.json"), "utf8"));
	const list = Array.isArray(version.coreOverrides) ? version.coreOverrides : [];
	return new Set(list.map((entry) => entry.path));
}

const next = `${JSON.stringify({ files: hashes() }, null, "\t")}\n`;

if (!process.argv.includes("--check")) {
	writeFileSync(OUT, next);
	console.log(`Wrote paper-core.lock.json (${Object.keys(JSON.parse(next).files).length} files).`);
	process.exit(0);
}

const locked = JSON.parse(readFileSync(OUT, "utf8")).files ?? {};
const current = hashes();
const declared = overrides();
const problems = [];
for (const [path, hash] of Object.entries(current)) {
	if (locked[path] !== hash && !declared.has(path)) {
		problems.push(`${path} changed without a coreOverrides entry`);
	}
}
for (const path of Object.keys(locked)) {
	if (!(path in current) && !declared.has(path)) {
		problems.push(`${path} was removed without a coreOverrides entry`);
	}
}
if (problems.length > 0) {
	console.error("Paper core drift:\n" + problems.map((line) => `  - ${line}`).join("\n"));
	console.error("Upstream: pnpm core:lock. Fork: add { path, reason } to paper-version.json coreOverrides.");
	process.exit(1);
}
console.log("paper-core.lock.json matches (or every drift is declared).");
