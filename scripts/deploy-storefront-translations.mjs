#!/usr/bin/env node
/**
 * Apply Paper storefront model attribute translations from per-locale YAML fixtures.
 * Configurator seeds English defaults; this script pushes PL/DE/FR/FI/NB via GraphQL.
 *
 * Fixtures: config/saleor/fixtures/translations/{locale}.yaml
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

const ROOT = resolve(import.meta.dirname, "..");
const FIXTURES_DIR = resolve(ROOT, "config/saleor/fixtures/translations");

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
// Writes translations to shared CMS state: require the configurator token explicitly rather
// than falling back to the narrow runtime SALEOR_APP_TOKEN (matches configurator-storefront-content.sh).
const TOKEN = process.env.SALEOR_CONFIGURATOR_TOKEN;

if (!API_URL) {
	console.error("[deploy-translations] Missing NEXT_PUBLIC_SALEOR_API_URL (set in .env.local)");
	process.exit(1);
}

if (!TOKEN) {
	console.error("[deploy-translations] Missing SALEOR_CONFIGURATOR_TOKEN in .env.configurator.local");
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
	query ListStorefrontPagesForTranslation($after: String) {
		pages(first: 100, after: $after) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					slug
					attributes {
						attribute {
							slug
							inputType
						}
						values {
							id
						}
					}
				}
			}
		}
	}
`;

const TRANSLATE_VALUE = /* GraphQL */ `
	mutation TranslateAttributeValue(
		$id: ID!
		$languageCode: LanguageCodeEnum!
		$input: AttributeValueTranslationInput!
	) {
		attributeValueTranslate(id: $id, languageCode: $languageCode, input: $input) {
			errors {
				field
				message
				code
			}
		}
	}
`;

function loadFixtureFiles() {
	const files = readdirSync(FIXTURES_DIR)
		.filter((name) => name.endsWith(".yaml") || name.endsWith(".yml"))
		.sort();
	return files.map((name) => {
		const fixture = parse(readFileSync(resolve(FIXTURES_DIR, name), "utf8"));
		if (!fixture?.languageCode || !fixture?.pages) {
			throw new Error(`Invalid fixture ${name}: expected languageCode and pages`);
		}
		return { name, ...fixture };
	});
}

async function loadPageIndex() {
	const index = new Map();
	let after = null;
	for (;;) {
		const data = await gql(LIST_PAGES, { after });
		for (const edge of data.pages.edges) {
			const page = edge.node;
			if (!page.slug.startsWith("storefront-")) continue;
			const attributes = new Map();
			for (const assignment of page.attributes) {
				const value = assignment.values[0];
				if (!value?.id) continue;
				attributes.set(assignment.attribute.slug, {
					id: value.id,
					inputType: assignment.attribute.inputType,
				});
			}
			index.set(page.slug, attributes);
		}
		if (!data.pages.pageInfo.hasNextPage) break;
		after = data.pages.pageInfo.endCursor;
	}
	return index;
}

function translationInput(inputType, text) {
	if (inputType === "PLAIN_TEXT") return { plainText: String(text) };
	if (inputType === "RICH_TEXT") return { richText: String(text) };
	return null;
}

const fixtures = loadFixtureFiles();
const pageIndex = await loadPageIndex();

let applied = 0;
let skipped = 0;

for (const fixture of fixtures) {
	console.log(`[deploy-translations] ${fixture.name} (${fixture.languageCode})`);
	for (const [pageSlug, attributes] of Object.entries(fixture.pages)) {
		const pageAttributes = pageIndex.get(pageSlug);
		if (!pageAttributes) {
			console.warn(`  skip unknown page: ${pageSlug}`);
			continue;
		}
		for (const [attributeSlug, text] of Object.entries(attributes)) {
			if (text == null || text === "") {
				skipped++;
				continue;
			}
			const attribute = pageAttributes.get(attributeSlug);
			if (!attribute) {
				console.warn(`  skip unknown attribute ${pageSlug}.${attributeSlug}`);
				skipped++;
				continue;
			}
			const input = translationInput(attribute.inputType, text);
			if (!input) {
				skipped++;
				continue;
			}
			const result = await gql(TRANSLATE_VALUE, {
				id: attribute.id,
				languageCode: fixture.languageCode,
				input,
			});
			const errors = result.attributeValueTranslate.errors;
			if (errors?.length) {
				throw new Error(
					`${fixture.languageCode} ${pageSlug}.${attributeSlug}: ${errors.map((e) => e.message).join(", ")}`,
				);
			}
			applied++;
		}
	}
}

console.log(`[deploy-translations] Done — ${applied} translations applied, ${skipped} skipped`);
