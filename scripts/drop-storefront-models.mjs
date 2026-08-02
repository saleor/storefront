#!/usr/bin/env node
/**
 * Delete all Paper storefront Pages, PageTypes, and PAGE_TYPE attributes from Saleor.
 * Use before a clean configurator redeploy (avoids `-2` slug suffix collisions).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const SLUGS_PATH = resolve(ROOT, "src/lib/content/attribute-slugs.ts");

/** Attributes removed by ADR 0002 but may linger on dev instances after partial deploys. */
const LEGACY_STOREFRONT_ATTRIBUTE_SLUGS = [
	"breadcrumb-home",
	"breadcrumb-products",
	"drawer-item-count",
	"drawer-subtotal",
	"drawer-shipping",
	"drawer-shipping-free",
	"drawer-shipping-calculated",
	"drawer-total",
	"drawer-checkout",
	"drawer-continue-shopping",
	"drawer-remove-item",
	"drawer-decrease-quantity",
	"drawer-increase-quantity",
	"page-title",
	"page-quantity",
	"page-variant",
	"page-your-total",
	"page-shipping-note",
	"page-checkout",
	"shipping-flat-rate",
	"returns-are-free",
];

function loadExpectedAttributeSlugs() {
	const source = readFileSync(SLUGS_PATH, "utf8");
	const slugs = new Set(LEGACY_STOREFRONT_ATTRIBUTE_SLUGS);
	const pattern = /:\s*"([a-z0-9-]+)"/g;
	let match;
	while ((match = pattern.exec(source)) !== null) {
		slugs.add(match[1]);
	}
	return slugs;
}

/**
 * Orphan-net only. The authoritative attribute set comes from the storefront page types'
 * assigned attributes (collected before the types are deleted). This heuristic additionally
 * catches attributes left unassigned by a failed partial deploy, including the `-N` suffix
 * collisions Saleor mints (e.g. `announcement-message-2`). It deliberately requires the base
 * slug to be a known storefront attribute, so a slug merely ending in a number cannot match.
 */
function isStorefrontAttributeSlug(slug, expectedSlugs) {
	if (expectedSlugs.has(slug)) return true;
	const suffix = slug.match(/^(.+)-\d+$/);
	return suffix ? expectedSlugs.has(suffix[1]) : false;
}

function loadEnvFile(name) {
	const path = resolve(ROOT, name);
	try {
		for (const line of readFileSync(path, "utf8").split("\n")) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith("#")) continue;
			const eq = trimmed.indexOf("=");
			if (eq === -1) continue;
			const key = trimmed.slice(0, eq).trim();
			const value = trimmed.slice(eq + 1).trim();
			if (!(key in process.env)) process.env[key] = value;
		}
	} catch {
		// optional file
	}
}

loadEnvFile(".env.local");
loadEnvFile(".env.configurator.local");

const API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL;
// Destructive bulk deletes: require the dedicated configurator token explicitly. We do NOT
// fall back to SALEOR_APP_TOKEN (the narrow runtime token) — a tear-down should never run on
// the credential the storefront serves traffic with.
const TOKEN = process.env.SALEOR_CONFIGURATOR_TOKEN;

if (!API_URL) {
	console.error("[drop-storefront-models] Missing NEXT_PUBLIC_SALEOR_API_URL (set in .env.local)");
	process.exit(1);
}

if (!TOKEN) {
	console.error(
		"[drop-storefront-models] Missing SALEOR_CONFIGURATOR_TOKEN in .env.configurator.local (app-token fallback is disabled for destructive ops)",
	);
	process.exit(1);
}

async function gql(query, variables) {
	const response = await fetch(API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TOKEN}`,
		},
		body: JSON.stringify({ query, variables }),
	});
	const json = await response.json();
	if (json.errors?.length) {
		throw new Error(json.errors.map((e) => e.message).join("\n"));
	}
	return json.data;
}

const LIST_PAGES = /* GraphQL */ `
	query ListStorefrontPages($after: String) {
		pages(first: 100, after: $after) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					id
					slug
				}
			}
		}
	}
`;

const LIST_PAGE_TYPES = /* GraphQL */ `
	query ListStorefrontPageTypes($after: String) {
		pageTypes(first: 100, after: $after) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					id
					slug
					attributes {
						id
						slug
					}
				}
			}
		}
	}
`;

const BULK_DELETE_PAGES = /* GraphQL */ `
	mutation BulkDeletePages($ids: [ID!]!) {
		pageBulkDelete(ids: $ids) {
			errors {
				field
				message
			}
		}
	}
`;

const BULK_DELETE_PAGE_TYPES = /* GraphQL */ `
	mutation BulkDeletePageTypes($ids: [ID!]!) {
		pageTypeBulkDelete(ids: $ids) {
			errors {
				field
				message
			}
		}
	}
`;

const LIST_ATTRIBUTES = /* GraphQL */ `
	query ListPageTypeAttributes($after: String) {
		attributes(first: 100, after: $after, filter: { type: PAGE_TYPE }) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					id
					slug
				}
			}
		}
	}
`;

const BULK_DELETE_ATTRIBUTES = /* GraphQL */ `
	mutation BulkDeleteAttributes($ids: [ID!]!) {
		attributeBulkDelete(ids: $ids) {
			errors {
				field
				message
			}
		}
	}
`;

const expectedAttributeSlugs = loadExpectedAttributeSlugs();

async function collectIds(query, connectionName) {
	const ids = [];
	let after = null;
	for (;;) {
		const data = await gql(query, { after });
		const connection = data[connectionName];
		for (const edge of connection.edges) {
			if (edge.node.slug.startsWith("storefront-")) {
				ids.push(edge.node.id);
			}
		}
		if (!connection.pageInfo.hasNextPage) break;
		after = connection.pageInfo.endCursor;
	}
	return ids;
}

/** Storefront page-type IDs plus the attribute IDs they assign (authoritative — no slug guessing). */
async function collectPageTypes() {
	const typeIds = [];
	const attributeIds = new Set();
	let after = null;
	for (;;) {
		const data = await gql(LIST_PAGE_TYPES, { after });
		for (const edge of data.pageTypes.edges) {
			if (!edge.node.slug.startsWith("storefront-")) continue;
			typeIds.push(edge.node.id);
			for (const attribute of edge.node.attributes ?? []) {
				attributeIds.add(attribute.id);
			}
		}
		if (!data.pageTypes.pageInfo.hasNextPage) break;
		after = data.pageTypes.pageInfo.endCursor;
	}
	return { typeIds, attributeIds };
}

/** Orphan attributes (matching the storefront slug heuristic) not already covered by `known`. */
async function collectOrphanAttributeIds(known) {
	const ids = [];
	let after = null;
	for (;;) {
		const data = await gql(LIST_ATTRIBUTES, { after });
		for (const edge of data.attributes.edges) {
			if (known.has(edge.node.id)) continue;
			if (isStorefrontAttributeSlug(edge.node.slug, expectedAttributeSlugs)) {
				ids.push(edge.node.id);
			}
		}
		if (!data.attributes.pageInfo.hasNextPage) break;
		after = data.attributes.pageInfo.endCursor;
	}
	return ids;
}

async function bulkDelete(mutation, ids, label) {
	if (ids.length === 0) {
		console.log(`[drop-storefront-models] No ${label} to delete`);
		return;
	}
	const result = await gql(mutation, { ids });
	const errors = Object.values(result)[0]?.errors ?? [];
	if (errors.length > 0) {
		throw new Error(`Failed to delete ${label}: ${JSON.stringify(errors)}`);
	}
	console.log(`[drop-storefront-models] Deleted ${ids.length} ${label}`);
}

// Read the page types' assigned attributes first — they are the authoritative set to delete.
const { typeIds: pageTypeIds, attributeIds: assignedAttributeIds } = await collectPageTypes();

const pageIds = await collectIds(LIST_PAGES, "pages");
await bulkDelete(BULK_DELETE_PAGES, pageIds, "pages");

await bulkDelete(BULK_DELETE_PAGE_TYPES, pageTypeIds, "page types");

const orphanAttributeIds = await collectOrphanAttributeIds(assignedAttributeIds);
const attributeIds = [...assignedAttributeIds, ...orphanAttributeIds];
await bulkDelete(BULK_DELETE_ATTRIBUTES, attributeIds, "page-type attributes");

console.log("[drop-storefront-models] Done");
