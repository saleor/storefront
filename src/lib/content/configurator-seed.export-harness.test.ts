import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { it } from "vitest";
import { formatConfiguratorSeedYamlSection } from "@/lib/content/configurator-seed";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import {
	buildStorefrontContentSnapshotFromYaml,
	formatStorefrontContentSnapshotJson,
} from "@/lib/content/storefront-content-snapshot";

const ROOT = resolve(import.meta.dirname, "../../..");
const CONFIG_PATH = resolve(ROOT, "config/saleor/storefront-content.config.yml");
const SNAPSHOT_PATH = resolve(ROOT, "config/saleor/storefront-content.snapshot.json");

/**
 * Invoked only by `pnpm content:export-seed` (excluded from default `pnpm test:run`).
 * Writes the generated `models:` block into storefront-content.config.yml and regenerates
 * storefront-content.snapshot.json for the Paper app.
 */
it("exports configurator seed models and Paper content snapshot", () => {
	const source = readFileSync(CONFIG_PATH, "utf8");
	const modelsIndex = source.indexOf("models:\n");

	if (modelsIndex === -1) {
		throw new Error("models: section not found in storefront-content.config.yml");
	}

	const head = source.slice(0, modelsIndex);
	const modelsYaml = formatConfiguratorSeedYamlSection(defaultStorefrontContent);
	const nextYaml = `${head}${modelsYaml}\n`;
	writeFileSync(CONFIG_PATH, nextYaml);

	const snapshot = buildStorefrontContentSnapshotFromYaml(nextYaml);
	writeFileSync(SNAPSHOT_PATH, formatStorefrontContentSnapshotJson(snapshot));
});
