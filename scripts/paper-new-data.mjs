#!/usr/bin/env node
/**
 * pnpm paper:new data <cached-entity|live-query|mutation> <Name>
 *
 * Scaffolds a GraphQL document and prints the registry and loader steps.
 * It does not edit operations.ts, so the contract test stays the checklist.
 */
import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const [, , kind, name] = process.argv.slice(2);
const kinds = new Set(["cached-entity", "live-query", "mutation"]);
if (!kinds.has(kind) || !name || !/^[A-Z][A-Za-z0-9]+$/.test(name)) {
	console.error("Usage: pnpm paper:new data <cached-entity|live-query|mutation> <PascalName>");
	process.exit(1);
}

const root = join(import.meta.dirname, "..");
const operation = kind === "mutation" ? "mutation" : "query";
const file = join(root, "src/graphql", `${name}.graphql`);
if (existsSync(file)) {
	console.error(`${file} already exists`);
	process.exit(1);
}

const body =
	kind === "mutation"
		? `${operation} ${name}($id: ID!) {\n\t# fill in\n}\n`
		: `${operation} ${name}($slug: String!, $channel: String!, $languageCode: LanguageCodeEnum!) {\n\t# fill in\n}\n`;

writeFileSync(file, body);
const access = kind === "mutation" ? "mutate" : kind === "live-query" ? "live" : "cached";
console.log(`Wrote ${file}`);
console.log(
	`Next: register ${name} as access "${access}" in src/lib/saleor/operations.ts (or src/config/data-extensions.ts).`,
);
console.log("Then call it from a loader or server action and run pnpm generate && pnpm data:lock.");
