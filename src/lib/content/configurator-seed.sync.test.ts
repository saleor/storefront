import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import {
	buildConfiguratorSeedModels,
	serializeConfiguratorSeedModels,
} from "@/lib/content/configurator-seed";
import { defaultStorefrontContent } from "@/lib/content/defaults";

const ROOT = resolve(import.meta.dirname, "../../..");
const CONFIG_PATH = resolve(ROOT, "config/saleor/storefront-content.config.yml");

describe("configurator seed sync", () => {
	it("storefront-content.config.yml models match defaults.ts", () => {
		const expected = buildConfiguratorSeedModels(defaultStorefrontContent);
		const config = parse(readFileSync(CONFIG_PATH, "utf8")) as {
			models: ReturnType<typeof buildConfiguratorSeedModels>;
		};

		const normalize = (models: ReturnType<typeof buildConfiguratorSeedModels>) =>
			JSON.parse(serializeConfiguratorSeedModels(models));

		expect(normalize(config.models)).toEqual(normalize(expected));
	});
});
