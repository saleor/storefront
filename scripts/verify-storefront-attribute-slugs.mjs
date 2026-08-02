#!/usr/bin/env node
/**
 * Verify contentAttribute display names in storefront-content.config.yml slugify
 * to the slugs in src/lib/content/attribute-slugs.ts.
 *
 * Optional remote check: NEXT_PUBLIC_SALEOR_API_URL + SALEOR_CONFIGURATOR_TOKEN (or SALEOR_APP_TOKEN)
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const CONFIG_PATH = resolve(ROOT, "config/saleor/storefront-content.config.yml");
const SLUGS_PATH = resolve(ROOT, "src/lib/content/attribute-slugs.ts");

/** Saleor-style slug from attribute display name (Configurator / Dashboard). */
function slugifyAttributeName(name) {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function loadExpectedSlugs() {
	const source = readFileSync(SLUGS_PATH, "utf8");
	const slugs = new Set();
	const pattern = /:\s*"([a-z0-9-]+)"/g;
	let match;
	while ((match = pattern.exec(source)) !== null) {
		slugs.add(match[1]);
	}
	return slugs;
}

function loadConfigAttributeNames() {
	const source = readFileSync(CONFIG_PATH, "utf8");
	const inContentAttributes = source.indexOf("contentAttributes:");
	if (inContentAttributes === -1) return [];

	const tail = source.slice(inContentAttributes);
	const end = tail.search(/\nmodelTypes:/);
	const block = end === -1 ? tail : tail.slice(0, end);
	const names = [];
	const namePattern = /^\s+-\s+name:\s+(.+)$/gm;
	let match;
	while ((match = namePattern.exec(block)) !== null) {
		names.push(match[1].trim().replace(/^["']|["']$/g, ""));
	}
	return names;
}

async function verifyRemoteSlugs(expectedSlugs) {
	const url = process.env.NEXT_PUBLIC_SALEOR_API_URL ?? process.env.SALEOR_URL;
	const token = process.env.SALEOR_CONFIGURATOR_TOKEN ?? process.env.SALEOR_APP_TOKEN;

	if (!url || !token) {
		console.log("[skip] Remote slug check (set NEXT_PUBLIC_SALEOR_API_URL + token)");
		return;
	}

	const query = `{
		attributes(first: 100, filter: { type: PAGE_TYPE }) {
			edges { node { slug name } }
		}
	}`;

	let response;
	try {
		response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ query }),
		});
	} catch (error) {
		console.warn(`[skip] Remote slug check (${error instanceof Error ? error.message : error})`);
		return;
	}

	if (!response.ok) {
		console.error(`[fail] Remote attribute fetch: HTTP ${response.status}`);
		process.exit(1);
	}

	const json = await response.json();
	if (json.errors?.length) {
		console.error("[fail] Remote attribute fetch:", json.errors[0]?.message);
		process.exit(1);
	}

	const remoteBySlug = new Map(json.data?.attributes?.edges?.map(({ node }) => [node.slug, node.name]) ?? []);

	const missing = [...expectedSlugs].filter((slug) => !remoteBySlug.has(slug));
	if (missing.length > 0) {
		console.error("[fail] Expected slugs missing in Saleor:", missing.join(", "));
		process.exit(1);
	}

	console.log(`[ok] Remote: ${expectedSlugs.size} storefront attribute slugs present in Saleor`);
}

async function main() {
	const expectedSlugs = loadExpectedSlugs();
	const names = loadConfigAttributeNames();
	const mismatches = [];

	for (const name of names) {
		const slug = slugifyAttributeName(name);
		if (!expectedSlugs.has(slug)) {
			mismatches.push({ name, slug, reason: "slug not in attribute-slugs.ts" });
		}
	}

	if (mismatches.length > 0) {
		console.error("[fail] Config ↔ attribute-slugs.ts mismatches:");
		for (const row of mismatches) {
			console.error(`  - "${row.name}" → ${row.slug} (${row.reason})`);
		}
		process.exit(1);
	}

	console.log(`[ok] ${names.length} contentAttribute names match attribute-slugs.ts`);
	await verifyRemoteSlugs(expectedSlugs);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
