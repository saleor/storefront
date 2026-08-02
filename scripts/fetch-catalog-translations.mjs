#!/usr/bin/env node
/**
 * EXPERIMENTAL — not officially supported. May change or be removed without notice.
 *
 * Pull English catalog copy from Saleor and write locales/catalog-source.json.
 *
 * Usage:
 *   node scripts/fetch-catalog-translations.mjs
 *
 * Requires NEXT_PUBLIC_SALEOR_API_URL and SALEOR_CONFIGURATOR_TOKEN
 * (.env.configurator.local — same as other configurator scripts).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import {
	CATALOG_LOCALES_DIR,
	CATALOG_SOURCE_FILE,
	createGqlClient,
	editorJsToPlain,
	getSaleorCredentials,
	getThrottleConfig,
	loadEnvFromArgs,
	normalizeOptionalString,
} from "./lib/catalog-translations.mjs";

loadEnvFromArgs();

const { apiUrl, token } = getSaleorCredentials();
const channel = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL?.trim() || "default-channel";

if (!apiUrl) {
	console.error("[catalog:fetch] Missing NEXT_PUBLIC_SALEOR_API_URL");
	process.exit(1);
}
if (!token) {
	console.error("[catalog:fetch] Missing SALEOR_CONFIGURATOR_TOKEN (.env.configurator.local)");
	process.exit(1);
}

const gql = createGqlClient(apiUrl, token);

const LIST_CATEGORIES = /* GraphQL */ `
	query ListCategories($after: String) {
		categories(first: 100, after: $after) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					slug
					name
					description
					seoTitle
					seoDescription
				}
			}
		}
	}
`;

const LIST_COLLECTIONS = /* GraphQL */ `
	query ListCollections($after: String) {
		collections(first: 100, after: $after) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					slug
					name
					description
					seoTitle
					seoDescription
				}
			}
		}
	}
`;

const LIST_PRODUCTS = /* GraphQL */ `
	query ListProducts($after: String, $channel: String!) {
		products(first: 100, after: $after, channel: $channel) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					slug
					name
					description
					seoTitle
					seoDescription
					category {
						slug
					}
					attributes {
						attribute {
							slug
							inputType
						}
						values {
							id
							name
							plainText
						}
					}
				}
			}
		}
	}
`;

const LIST_ATTRIBUTES = /* GraphQL */ `
	query ListAttributes($after: String) {
		attributes(first: 100, after: $after) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					slug
					name
					inputType
					choices(first: 100) {
						edges {
							node {
								slug
								name
							}
						}
					}
				}
			}
		}
	}
`;

async function paginate(query, variables = {}) {
	const items = [];
	let after = null;
	for (;;) {
		const data = await gql(query, { ...variables, after });
		const connection = data.categories ?? data.collections ?? data.products ?? data.attributes;
		items.push(...connection.edges.map((edge) => edge.node));
		if (!connection.pageInfo.hasNextPage) break;
		after = connection.pageInfo.endCursor;
	}
	return items;
}

function toFixtureRecord(entity) {
	return {
		name: entity.name,
		description: editorJsToPlain(entity.description),
		seoTitle: normalizeOptionalString(entity.seoTitle),
		seoDescription: normalizeOptionalString(entity.seoDescription),
	};
}

function indexBySlug(items) {
	return Object.fromEntries(items.map((item) => [item.slug, toFixtureRecord(item)]));
}

function indexAttributes(items) {
	return Object.fromEntries(
		items.map((attribute) => [
			attribute.slug,
			{
				name: attribute.name,
				inputType: attribute.inputType,
				values: Object.fromEntries(attribute.choices.edges.map((edge) => [edge.node.slug, edge.node.name])),
			},
		]),
	);
}

function indexProductAttributeValues(products) {
	const PLAIN_TEXT_TYPES = new Set(["PLAIN_TEXT", "MULTI_LINE_TEXT", "RICH_TEXT"]);
	const result = {};

	for (const product of products) {
		const attributes = {};
		for (const assignment of product.attributes ?? []) {
			if (!PLAIN_TEXT_TYPES.has(assignment.attribute.inputType)) continue;
			const value = assignment.values[0];
			const text = normalizeOptionalString(value?.plainText) ?? normalizeOptionalString(value?.name);
			if (!text) continue;
			attributes[assignment.attribute.slug] = text;
		}
		if (Object.keys(attributes).length > 0) {
			result[product.slug] = attributes;
		}
	}

	return result;
}

const throttle = getThrottleConfig();
console.warn("[catalog] EXPERIMENTAL tooling — not officially supported; may change or be removed.");
console.log(`[catalog:fetch] ${apiUrl} (channel: ${channel})`);
console.log(
	`[catalog:fetch] throttle: ≤${throttle.maxConcurrent} concurrent, ${throttle.minDelayMs}ms spacing, ${throttle.timeoutMs}ms timeout`,
);

const [categories, collections, products, attributes] = await Promise.all([
	paginate(LIST_CATEGORIES),
	paginate(LIST_COLLECTIONS),
	paginate(LIST_PRODUCTS, { channel }),
	paginate(LIST_ATTRIBUTES),
]);

const source = {
	fetchedAt: new Date().toISOString(),
	apiUrl,
	channel,
	categories: indexBySlug(categories),
	collections: indexBySlug(collections),
	products: Object.fromEntries(
		products.map((product) => [
			product.slug,
			{
				...toFixtureRecord(product),
				category: product.category?.slug ?? null,
			},
		]),
	),
	attributes: indexAttributes(attributes),
	productAttributes: indexProductAttributeValues(products),
};

mkdirSync(CATALOG_LOCALES_DIR, { recursive: true });
writeFileSync(CATALOG_SOURCE_FILE, `${JSON.stringify(source, null, 2)}\n`, "utf8");

const plainTextCount = Object.values(source.productAttributes).reduce(
	(sum, attrs) => sum + Object.keys(attrs).length,
	0,
);
console.log(
	`[catalog:fetch] Wrote ${CATALOG_SOURCE_FILE} — ${categories.length} categories, ${collections.length} collections, ${products.length} products, ${attributes.length} attributes, ${plainTextCount} product text attributes`,
);
console.log(
	"[catalog:fetch] Next: copy examples/ to locales/, translate slugs from catalog-source.json, then pnpm catalog:translations:plan",
);
