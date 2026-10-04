#!/usr/bin/env node
/**
 * Prove a data-layer ESLint rule fires.
 *
 * Writes a known-bad file, runs ESLint on it, asserts the expected rule id,
 * then deletes the file. A rule that never reports would still leave `verify` green.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const dir = join(ROOT, "src/lib/custom");
const file = join(dir, "__canary__.ts");

const canaries = [
	{
		id: "paper/saleor-access",
		body: 'import { cachedQuery } from "@/lib/saleor/client";\nexport const x = cachedQuery;\n',
	},
	{
		id: "paper/no-direct-saleor",
		body: 'import { createClient } from "urql";\nexport const client = createClient({ url: "http://example" });\n',
	},
	{
		id: "paper/cache-api",
		body: 'import { cacheTag } from "next/cache";\nexport const tag = cacheTag;\n',
	},
];

mkdirSync(dir, { recursive: true });
let failed = 0;

for (const canary of canaries) {
	writeFileSync(file, canary.body);
	const result = spawnSync("pnpm", ["exec", "eslint", "--no-ignore", file], {
		cwd: ROOT,
		encoding: "utf8",
	});
	const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
	if (!output.includes(canary.id)) {
		failed++;
		console.error(`canary ${canary.id} did not fire:\n${output}`);
	} else {
		console.log(`canary ${canary.id} fired`);
	}
}

rmSync(file, { force: true });
if (failed > 0) process.exit(1);
