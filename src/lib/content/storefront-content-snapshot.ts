/**
 * Machine-readable storefront Models snapshot for Paper app init (and verify).
 * SoT: config/saleor/storefront-content.config.yml (+ models exported from defaults.ts).
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import type { ConfiguratorSeedModel } from "@/lib/content/configurator-seed";

/** Bump when attribute/PageType shape changes in a way Paper app applyers must notice. */
export const PAPER_CONTENT_SCHEMA_VERSION = 1 as const;

export type StorefrontContentSnapshotAttribute = {
	name: string;
	/** Saleor slug (from Configurator name slugify). */
	slug: string;
	inputType: string;
	entityType?: string;
};

export type StorefrontContentSnapshotModelType = {
	name: string;
	slug: string;
	/** Attribute display names assigned to this PageType. */
	attributes: string[];
};

export type StorefrontContentSnapshot = {
	paperContentSchemaVersion: typeof PAPER_CONTENT_SCHEMA_VERSION;
	/** Stable hash of attributes + modelTypes + models (for drift checks). */
	contentHash: string;
	contentAttributes: StorefrontContentSnapshotAttribute[];
	modelTypes: StorefrontContentSnapshotModelType[];
	models: ConfiguratorSeedModel[];
};

type YamlConfig = {
	contentAttributes: Array<{
		name: string;
		inputType: string;
		entityType?: string;
	}>;
	modelTypes: Array<{
		name: string;
		slug: string;
		attributes: Array<{ attribute: string }>;
	}>;
	models: ConfiguratorSeedModel[];
};

/** Saleor/Configurator-style slugify for attribute display names. */
export function slugifyAttributeName(name: string): string {
	return name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function canonicalize(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(canonicalize);
	}
	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value as Record<string, unknown>)
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([k, v]) => [k, canonicalize(v)]),
		);
	}
	return value;
}

function contentHashPayload(snapshot: Omit<StorefrontContentSnapshot, "contentHash">): string {
	// Include schema version so bumps alone change the hash; canonicalize for stable order.
	return JSON.stringify(canonicalize(snapshot));
}

export function computeSnapshotContentHash(snapshot: Omit<StorefrontContentSnapshot, "contentHash">): string {
	return createHash("sha256").update(contentHashPayload(snapshot)).digest("hex").slice(0, 16);
}

export function buildStorefrontContentSnapshotFromYaml(yamlSource: string): StorefrontContentSnapshot {
	const config = parse(yamlSource) as YamlConfig;

	const contentAttributes: StorefrontContentSnapshotAttribute[] = config.contentAttributes.map((attr) => ({
		name: attr.name,
		slug: slugifyAttributeName(attr.name),
		inputType: attr.inputType,
		...(attr.entityType ? { entityType: attr.entityType } : {}),
	}));

	const modelTypes: StorefrontContentSnapshotModelType[] = config.modelTypes.map((type) => ({
		name: type.name,
		slug: type.slug,
		attributes: type.attributes.map((a) => a.attribute),
	}));

	const withoutHash = {
		paperContentSchemaVersion: PAPER_CONTENT_SCHEMA_VERSION,
		contentAttributes,
		modelTypes,
		models: config.models,
	};

	return {
		...withoutHash,
		contentHash: computeSnapshotContentHash(withoutHash),
	};
}

export function formatStorefrontContentSnapshotJson(snapshot: StorefrontContentSnapshot): string {
	// Tab indent matches repo Prettier (`useTabs`), but keep full expand — do not run
	// Prettier on this file (see .prettierignore) or short arrays collapse and drift.
	return `${JSON.stringify(snapshot, null, "\t")}\n`;
}

export function readStorefrontContentConfigYaml(root = resolve(import.meta.dirname, "../../..")): string {
	return readFileSync(resolve(root, "config/saleor/storefront-content.config.yml"), "utf8");
}
