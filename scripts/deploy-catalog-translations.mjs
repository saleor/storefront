#!/usr/bin/env node
/**
 * EXPERIMENTAL — not officially supported. May change or be removed without notice.
 * Run only against dev/staging Saleor instances you control.
 *
 * Apply catalog translations (categories, collections, products) from YAML fixtures.
 * Niche by design: most shops translate catalog copy in the Dashboard (a merchandiser
 * task). Primary intended use is seeding/bootstrapping or bulk import from an external
 * translation system (TMS) exported to the locales/*.yaml shape.
 *
 * Fixtures (gitignored, local only): config/saleor/fixtures/catalog-translations/locales/
 * Templates (never deployed):       config/saleor/fixtures/catalog-translations/examples/
 *
 * Usage:
 *   node scripts/deploy-catalog-translations.mjs --dry-run
 *   node scripts/deploy-catalog-translations.mjs --fail-on-skip
 *   node scripts/deploy-catalog-translations.mjs --help
 */
import {
	CliUsageError,
	assertTranslationPermissions,
	createGqlClient,
	editorJsToPlain,
	getSaleorCredentials,
	getThrottleConfig,
	loadAllChoices,
	loadCatalogSourceSnapshot,
	loadEnvFromArgs,
	loadLocaleFixtureFiles,
	parseCatalogCliArgs,
	planFixtureTranslations,
	reportFixtureCoverage,
	resolveLocalesDir,
	summarizeSkipped,
} from "./lib/catalog-translations.mjs";

const USAGE = `Usage: node scripts/deploy-catalog-translations.mjs [options]

Options:
  --dry-run        Plan only; no writes
  --fail-on-skip   Abort before writing if any fixture entry is a data error (unknown slug, empty value)
  --allow-skip     Don't abort on data errors
  --overwrite      Also update existing translations that differ from the fixture
  --env <file>     Load credentials from this env file only (default: .env.local, .env.configurator.local)
  --locales <dir>  Read fixtures from this directory (default: config/saleor/fixtures/catalog-translations/locales)
  --help, -h       Show this help`;

// The command line and env file are settled before anything else: a mistyped flag must stop the
// run, not turn a plan into a deploy.
let cli;
try {
	cli = parseCatalogCliArgs();
	if (!cli.help) loadEnvFromArgs();
} catch (error) {
	if (!(error instanceof CliUsageError)) throw error;
	console.error(`[catalog:deploy] ${error.message}\n\n${USAGE}`);
	process.exit(1);
}
if (cli.help) {
	console.log(USAGE);
	process.exit(0);
}

const { dir: localesDir, sourceFile } = resolveLocalesDir(cli.localesDir);

const { apiUrl, token } = getSaleorCredentials();
const channel = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL?.trim() || "default-channel";

if (!apiUrl) {
	console.error("[catalog:deploy] Missing NEXT_PUBLIC_SALEOR_API_URL");
	process.exit(1);
}
if (!token) {
	console.error("[catalog:deploy] Missing SALEOR_CONFIGURATOR_TOKEN (.env.configurator.local)");
	process.exit(1);
}

let fixtures;
try {
	fixtures = loadLocaleFixtureFiles(localesDir);
} catch (error) {
	console.error(`[catalog:deploy] ${error.message}`);
	process.exit(1);
}
if (fixtures.length === 0) {
	console.error(
		`[catalog:deploy] No locale fixtures in ${localesDir}\n` +
			"  1. Run: pnpm catalog:translations:fetch\n" +
			"  2. Copy config/saleor/fixtures/catalog-translations/examples/ as a starting point\n" +
			"  3. Add your locale YAML files to locales/ (gitignored — never commit real catalog slugs)",
	);
	process.exit(1);
}

const gql = createGqlClient(apiUrl, token);

const LIST_CATEGORIES = /* GraphQL */ `
	query ListCategoryIds($after: String) {
		categories(first: 100, after: $after) {
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

const LIST_COLLECTIONS = /* GraphQL */ `
	query ListCollectionIds($after: String) {
		collections(first: 100, after: $after) {
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

const LIST_PRODUCTS = /* GraphQL */ `
	query ListProductIds($after: String, $channel: String!) {
		products(first: 100, after: $after, channel: $channel) {
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

const LIST_PRODUCT_ATTRIBUTES = /* GraphQL */ `
	query ListProductAttributeIds($after: String, $channel: String!) {
		products(first: 100, after: $after, channel: $channel) {
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

const LIST_ATTRIBUTES = /* GraphQL */ `
	query ListAttributeIds($after: String) {
		attributes(first: 100, after: $after) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					id
					slug
					inputType
					choices(first: 100) {
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
			}
		}
	}
`;

const MORE_ATTRIBUTE_CHOICES = /* GraphQL */ `
	query MoreAttributeChoiceIds($id: ID!, $after: String) {
		attribute(id: $id) {
			choices(first: 100, after: $after) {
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
	}
`;

const MUTATIONS = {
	categoryTranslate: /* GraphQL */ `
		mutation CategoryTranslate($id: ID!, $languageCode: LanguageCodeEnum!, $input: TranslationInput!) {
			categoryTranslate(id: $id, languageCode: $languageCode, input: $input) {
				errors {
					field
					message
					code
				}
			}
		}
	`,
	collectionTranslate: /* GraphQL */ `
		mutation CollectionTranslate($id: ID!, $languageCode: LanguageCodeEnum!, $input: TranslationInput!) {
			collectionTranslate(id: $id, languageCode: $languageCode, input: $input) {
				errors {
					field
					message
					code
				}
			}
		}
	`,
	productTranslate: /* GraphQL */ `
		mutation ProductTranslate($id: ID!, $languageCode: LanguageCodeEnum!, $input: TranslationInput!) {
			productTranslate(id: $id, languageCode: $languageCode, input: $input) {
				errors {
					field
					message
					code
				}
			}
		}
	`,
	attributeTranslate: /* GraphQL */ `
		mutation AttributeTranslate($id: ID!, $languageCode: LanguageCodeEnum!, $input: NameTranslationInput!) {
			attributeTranslate(id: $id, languageCode: $languageCode, input: $input) {
				errors {
					field
					message
					code
				}
			}
		}
	`,
	attributeValueTranslate: /* GraphQL */ `
		mutation AttributeValueTranslate(
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
	`,
};

async function loadSlugIndex(query, variables = {}) {
	const index = new Map();
	let after = null;
	for (;;) {
		const data = await gql(query, { ...variables, after });
		const connection = data.categories ?? data.collections ?? data.products;
		for (const edge of connection.edges) {
			index.set(edge.node.slug, edge.node.id);
		}
		if (!connection.pageInfo.hasNextPage) break;
		after = connection.pageInfo.endCursor;
	}
	return index;
}

async function loadAttributeIndex() {
	const index = new Map();
	let after = null;
	for (;;) {
		const data = await gql(LIST_ATTRIBUTES, { after });
		for (const edge of data.attributes.edges) {
			const attribute = edge.node;
			const choices = await loadAllChoices(gql, attribute, MORE_ATTRIBUTE_CHOICES);
			const values = new Map(choices.map((choice) => [choice.slug, choice.id]));
			index.set(attribute.slug, { id: attribute.id, inputType: attribute.inputType, values });
		}
		if (!data.attributes.pageInfo.hasNextPage) break;
		after = data.attributes.pageInfo.endCursor;
	}
	return index;
}

async function loadProductAttributeValueIndex(channel) {
	const index = new Map();
	const PLAIN_TEXT_TYPES = new Set(["PLAIN_TEXT", "MULTI_LINE_TEXT", "RICH_TEXT"]);
	let after = null;
	for (;;) {
		const data = await gql(LIST_PRODUCT_ATTRIBUTES, { after, channel });
		for (const edge of data.products.edges) {
			const attributes = new Map();
			for (const assignment of edge.node.attributes) {
				if (!PLAIN_TEXT_TYPES.has(assignment.attribute.inputType)) continue;
				const valueId = assignment.values[0]?.id;
				if (valueId) {
					attributes.set(assignment.attribute.slug, valueId);
				}
			}
			if (attributes.size > 0) {
				index.set(edge.node.slug, attributes);
			}
		}
		if (!data.products.pageInfo.hasNextPage) break;
		after = data.products.pageInfo.endCursor;
	}
	return index;
}

const EXISTING_CATEGORY_TRANSLATIONS = /* GraphQL */ `
	query ExistingCategoryTranslations($after: String, $languageCode: LanguageCodeEnum!) {
		categories(first: 100, after: $after) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					slug
					translation(languageCode: $languageCode) {
						name
						description
						seoTitle
						seoDescription
						slug
					}
				}
			}
		}
	}
`;

const EXISTING_COLLECTION_TRANSLATIONS = /* GraphQL */ `
	query ExistingCollectionTranslations($after: String, $languageCode: LanguageCodeEnum!) {
		collections(first: 100, after: $after) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					slug
					translation(languageCode: $languageCode) {
						name
						description
						seoTitle
						seoDescription
						slug
					}
				}
			}
		}
	}
`;

const EXISTING_PRODUCT_TRANSLATIONS = /* GraphQL */ `
	query ExistingProductTranslations($after: String, $channel: String!, $languageCode: LanguageCodeEnum!) {
		products(first: 100, after: $after, channel: $channel) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					slug
					translation(languageCode: $languageCode) {
						name
						description
						seoTitle
						seoDescription
						slug
					}
					attributes {
						attribute {
							slug
							inputType
						}
						values {
							translation(languageCode: $languageCode) {
								name
								plainText
								richText
							}
						}
					}
				}
			}
		}
	}
`;

const EXISTING_ATTRIBUTE_TRANSLATIONS = /* GraphQL */ `
	query ExistingAttributeTranslations($after: String, $languageCode: LanguageCodeEnum!) {
		attributes(first: 100, after: $after) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					id
					slug
					translation(languageCode: $languageCode) {
						name
					}
					choices(first: 100) {
						pageInfo {
							hasNextPage
							endCursor
						}
						edges {
							node {
								slug
								translation(languageCode: $languageCode) {
									name
								}
							}
						}
					}
				}
			}
		}
	}
`;

const MORE_EXISTING_CHOICE_TRANSLATIONS = /* GraphQL */ `
	query MoreExistingChoiceTranslations($id: ID!, $after: String, $languageCode: LanguageCodeEnum!) {
		attribute(id: $id) {
			choices(first: 100, after: $after) {
				pageInfo {
					hasNextPage
					endCursor
				}
				edges {
					node {
						slug
						translation(languageCode: $languageCode) {
							name
						}
					}
				}
			}
		}
	}
`;

const PLAIN_TEXT_ATTRIBUTE_TYPES = new Set(["PLAIN_TEXT", "MULTI_LINE_TEXT", "RICH_TEXT"]);

function entityTranslation(translation) {
	return {
		name: translation.name ?? null,
		description: editorJsToPlain(translation.description),
		seoTitle: translation.seoTitle ?? null,
		seoDescription: translation.seoDescription ?? null,
		slug: translation.slug ?? null,
	};
}

async function loadEntityTranslations(query, languageCode) {
	const map = new Map();
	let after = null;
	for (;;) {
		const data = await gql(query, { languageCode, after });
		const connection = data.categories ?? data.collections;
		for (const edge of connection.edges) {
			if (edge.node.translation) {
				map.set(edge.node.slug, entityTranslation(edge.node.translation));
			}
		}
		if (!connection.pageInfo.hasNextPage) break;
		after = connection.pageInfo.endCursor;
	}
	return map;
}

/** Products and the text they have in text attributes, in one pass over the product list. */
async function loadExistingProductTranslations(languageCode, channel) {
	const products = new Map();
	const productAttributes = new Map();
	let after = null;
	for (;;) {
		const data = await gql(EXISTING_PRODUCT_TRANSLATIONS, { after, channel, languageCode });
		for (const edge of data.products.edges) {
			if (edge.node.translation) {
				products.set(edge.node.slug, entityTranslation(edge.node.translation));
			}
			for (const assignment of edge.node.attributes) {
				if (!PLAIN_TEXT_ATTRIBUTE_TYPES.has(assignment.attribute.inputType)) continue;
				const translation = assignment.values[0]?.translation;
				if (!translation) continue;
				productAttributes.set(`${edge.node.slug}.${assignment.attribute.slug}`, {
					name: translation.name ?? null,
					plainText: translation.plainText ?? null,
					// A translation made in the Dashboard for a RICH_TEXT attribute has richText only.
					richText: translation.richText ?? null,
				});
			}
		}
		if (!data.products.pageInfo.hasNextPage) break;
		after = data.products.pageInfo.endCursor;
	}
	return { products, productAttributes };
}

async function loadExistingAttributeTranslations(languageCode) {
	const map = new Map();
	let after = null;
	for (;;) {
		const data = await gql(EXISTING_ATTRIBUTE_TRANSLATIONS, { after, languageCode });
		for (const edge of data.attributes.edges) {
			const choices = await loadAllChoices(gql, edge.node, MORE_EXISTING_CHOICE_TRANSLATIONS, {
				languageCode,
			});
			const values = new Map();
			for (const choice of choices) {
				if (choice.translation?.name) {
					values.set(choice.slug, choice.translation.name);
				}
			}
			map.set(edge.node.slug, { name: edge.node.translation?.name ?? null, values });
		}
		if (!data.attributes.pageInfo.hasNextPage) break;
		after = data.attributes.pageInfo.endCursor;
	}
	return map;
}

async function loadExistingTranslations(languageCode, channel) {
	const [categories, collections, { products, productAttributes }, attributes] = await Promise.all([
		loadEntityTranslations(EXISTING_CATEGORY_TRANSLATIONS, languageCode),
		loadEntityTranslations(EXISTING_COLLECTION_TRANSLATIONS, languageCode),
		loadExistingProductTranslations(languageCode, channel),
		loadExistingAttributeTranslations(languageCode),
	]);
	return { categories, collections, products, attributes, productAttributes };
}

/** Saleor answered and refused this one entry (validation); other entries can still be written. */
class TranslationRejectedError extends Error {}

async function applyPlannedTranslation(entry) {
	const mutation = MUTATIONS[entry.mutation];
	const result = await gql(mutation, {
		id: entry.id,
		languageCode: entry.languageCode,
		input: entry.input,
	});
	const mutationKey = entry.mutation;
	const errors = result[mutationKey]?.errors;
	if (errors?.length) {
		throw new TranslationRejectedError(
			`${entry.languageCode} ${entry.kind}.${entry.slug}: ${errors.map((error) => error.message).join(", ")}`,
		);
	}
}

const modeLabel = cli.dryRun ? "plan" : "deploy";
console.warn("[catalog] EXPERIMENTAL tooling — not officially supported; may change or be removed.");
console.log(`[catalog:${modeLabel}] ${apiUrl} (channel: ${channel})`);

const throttle = getThrottleConfig();
console.log(
	`[catalog:${modeLabel}] throttle: ≤${throttle.maxConcurrent} concurrent, ${throttle.minDelayMs}ms spacing, ` +
		`${throttle.timeoutMs}ms timeout, ${throttle.maxRetries} retries ` +
		"(tune via SALEOR_MAX_CONCURRENT_REQUESTS / SALEOR_MIN_REQUEST_DELAY_MS / SALEOR_REQUEST_TIMEOUT_MS)",
);

await assertTranslationPermissions(gql);

const snapshot = loadCatalogSourceSnapshot(sourceFile);
if (!snapshot) {
	console.warn(
		`[catalog:deploy] No ${sourceFile} — run pnpm catalog:translations:fetch after seeding your catalog.`,
	);
}

const [categoryIndex, collectionIndex, productIndex, attributeIndex, productAttributeIndex] =
	await Promise.all([
		loadSlugIndex(LIST_CATEGORIES),
		loadSlugIndex(LIST_COLLECTIONS),
		loadSlugIndex(LIST_PRODUCTS, { channel }),
		loadAttributeIndex(),
		loadProductAttributeValueIndex(channel),
	]);

const indexes = {
	categoryIndex,
	collectionIndex,
	productIndex,
	attributeIndex,
	productAttributeIndex,
};

// Phase 1 — plan every fixture before writing anything, so --fail-on-skip can
// abort the whole run rather than leaving a partially-translated catalog behind.
// Existing translations are fetched per locale: create-only by default, so a field
// is only written when it is new — or, with --overwrite, when it differs.
const plan = [];
let totalNew = 0;
let totalOverwrite = 0;
let totalUnchanged = 0;
let totalProtected = 0;
let totalSkipped = 0;

for (const fixture of fixtures) {
	console.log(`[catalog:${modeLabel}] ${fixture.name} (${fixture.languageCode})`);
	for (const line of reportFixtureCoverage(fixture, indexes, snapshot)) {
		console.log(line);
	}

	const existing = await loadExistingTranslations(fixture.languageCode, channel);
	const {
		applied,
		skipped,
		protected: protectedEntries,
		unchanged,
	} = planFixtureTranslations(fixture, indexes, existing, { overwrite: cli.overwrite });

	const newCount = applied.filter((entry) => entry.change === "new").length;
	const overwriteCount = applied.length - newCount;
	totalNew += newCount;
	totalOverwrite += overwriteCount;
	totalUnchanged += unchanged;
	totalProtected += protectedEntries.length;
	totalSkipped += skipped.length;
	plan.push({ fixture, applied });

	console.log(
		`  new: ${newCount}, overwrite: ${overwriteCount}, unchanged: ${unchanged}, protected: ${protectedEntries.length}, skipped: ${skipped.length}`,
	);
	if (protectedEntries.length > 0) {
		console.log(`  protected (existing differs — pass --overwrite to update):`);
		for (const entry of protectedEntries) {
			console.log(`    - ${entry.kind} ${entry.slug}`);
		}
	}
	if (skipped.length > 0) {
		for (const line of summarizeSkipped(skipped)) {
			console.log(line);
		}
		for (const entry of skipped) {
			console.log(`    - ${entry.kind} ${entry.slug}: ${entry.reason}`);
		}
	}
}

// Phase 2 — gate on data errors (skipped) before any mutation runs.
// Protected entries are an intentional safety hold, not an error: they never gate the run.
const failOnSkip = cli.failOnSkip && !cli.allowSkip;
if (totalSkipped > 0 && failOnSkip) {
	console.error(
		`[catalog:${modeLabel}] Aborted before writing — ${totalSkipped} entries would be skipped. ` +
			"Fix fixture slugs (compare against locales/catalog-source.json), re-run fetch, or pass --allow-skip to override.",
	);
	process.exit(1);
}

const totalApplied = totalNew + totalOverwrite;

if (cli.dryRun) {
	console.log(
		`[catalog:plan] Done — ${totalApplied} would apply (${totalNew} new, ${totalOverwrite} overwrite), ` +
			`${totalUnchanged} unchanged, ${totalProtected} protected, ${totalSkipped} skipped`,
	);
	if (totalProtected > 0 && !cli.overwrite) {
		console.log("[catalog:plan] Re-run with --overwrite to update the protected (existing) translations.");
	}
	process.exit(0);
}

// Phase 3 — execute. An entry Saleor refuses is reported and the rest still go in; anything else
// (network, auth, a failing instance) stops the run. Either way a rerun writes only what is
// still missing, because written fields then compare as unchanged.
let written = 0;
const rejected = [];
for (const { applied } of plan) {
	for (const entry of applied) {
		try {
			await applyPlannedTranslation(entry);
			written++;
		} catch (error) {
			if (error instanceof TranslationRejectedError) {
				rejected.push(error.message);
				console.error(`[catalog:deploy] Rejected by Saleor — ${error.message}`);
				continue;
			}
			console.error(
				`[catalog:deploy] Stopped after ${written} of ${totalApplied} writes: ${error.message}\n` +
					"  What was written stays; run the deploy again to continue.",
			);
			process.exit(1);
		}
	}
}

if (rejected.length > 0) {
	console.error(
		`[catalog:deploy] ${written} applied, ${rejected.length} rejected by Saleor (listed above). ` +
			"Fix those fixture entries and run the deploy again.",
	);
	process.exit(1);
}

console.log(
	`[catalog:deploy] Done — ${written} applied (${totalNew} new, ${totalOverwrite} overwrite), ` +
		`${totalUnchanged} unchanged, ${totalProtected} protected, ${totalSkipped} skipped`,
);
if (totalProtected > 0 && !cli.overwrite) {
	console.log(
		`[catalog:deploy] ${totalProtected} existing translations were left unchanged. Re-run with --overwrite to update them.`,
	);
}
