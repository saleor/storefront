#!/usr/bin/env node
/**
 * Regenerate the `models:` section of storefront-content.config.yml from defaults.ts.
 *
 * English copy source of truth: src/lib/content/defaults.ts
 * Schema (contentAttributes, modelTypes) stays hand-edited in the YAML.
 *
 * Usage: pnpm content:export-seed
 */
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

execSync("pnpm exec vitest run src/lib/content/configurator-seed.export-harness.test.ts", {
	cwd: ROOT,
	stdio: "inherit",
});

execSync("pnpm content:verify-seed", { cwd: ROOT, stdio: "inherit" });
console.log("[content:export-seed] Updated models section in config/saleor/storefront-content.config.yml");
