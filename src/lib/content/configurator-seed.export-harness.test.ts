import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { it } from "vitest";
import { formatConfiguratorSeedYamlSection } from "@/lib/content/configurator-seed";
import { defaultStorefrontContent } from "@/lib/content/defaults";

const ROOT = resolve(import.meta.dirname, "../../..");
const CONFIG_PATH = resolve(ROOT, "config/saleor/storefront-content.config.yml");

/**
 * Invoked only by `pnpm content:export-seed` (excluded from default `pnpm test:run`).
 * Writes the generated `models:` block into storefront-content.config.yml.
 */
it("exports configurator seed models to storefront-content.config.yml", () => {
	const source = readFileSync(CONFIG_PATH, "utf8");
	const modelsIndex = source.indexOf("models:\n");

	if (modelsIndex === -1) {
		throw new Error("models: section not found in storefront-content.config.yml");
	}

	const head = source.slice(0, modelsIndex);
	const modelsYaml = formatConfiguratorSeedYamlSection(defaultStorefrontContent);
	writeFileSync(CONFIG_PATH, `${head}${modelsYaml}\n`);
});
