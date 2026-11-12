import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

export const ROOT = resolve(import.meta.dirname, "../..");
export const CATALOG_FIXTURES_DIR = resolve(ROOT, "config/saleor/fixtures/catalog-translations");
export const CATALOG_LOCALES_DIR = resolve(CATALOG_FIXTURES_DIR, "locales");
export const CATALOG_SOURCE_FILE = resolve(CATALOG_LOCALES_DIR, "catalog-source.json");

/** Default catalog language in Saleor — never push fixture translations for EN. */
export const RESERVED_LANGUAGE_CODES = new Set(["EN"]);

// Saleor's *Translate mutations require MANAGE_TRANSLATIONS only.
const REQUIRED_PERMISSIONS = ["MANAGE_TRANSLATIONS"];

/** A bad command line or env file. The scripts print the message and exit 1 before any request. */
export class CliUsageError extends Error {}

const BOOLEAN_FLAGS = new Map([
	["--dry-run", "dryRun"],
	["--fail-on-skip", "failOnSkip"],
	["--allow-skip", "allowSkip"],
	["--overwrite", "overwrite"],
]);

const VALUE_OPTIONS = new Map([
	["--env", "envFile"],
	["--locales", "localesDir"],
]);

/**
 * Strict on purpose: an argument that is not recognised stops the run. A mistyped `--dryrun`
 * or an unsupported `--env-file x` must never fall through to a real deploy against the
 * default instance.
 *
 * `flags` lists the boolean flags the calling script accepts (fetch takes none).
 */
export function parseCatalogCliArgs(
	argv = process.argv.slice(2),
	{ flags = [...BOOLEAN_FLAGS.keys()] } = {},
) {
	const options = {
		dryRun: false,
		failOnSkip: false,
		allowSkip: false,
		overwrite: false,
		envFile: null,
		localesDir: null,
		help: false,
	};
	const accepted = new Set(flags);

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		// `pnpm <script> -- --flag` forwards the separator itself.
		if (arg === "--") continue;
		if (arg === "--help" || arg === "-h") {
			options.help = true;
			continue;
		}

		const eq = arg.indexOf("=");
		const name = eq === -1 ? arg : arg.slice(0, eq);

		if (VALUE_OPTIONS.has(name)) {
			const value = eq === -1 ? argv[++i] : arg.slice(eq + 1);
			if (!value || (eq === -1 && value.startsWith("--"))) {
				throw new CliUsageError(`${name} needs a value`);
			}
			options[VALUE_OPTIONS.get(name)] = value;
			continue;
		}

		if (eq === -1 && accepted.has(arg) && BOOLEAN_FLAGS.has(arg)) {
			options[BOOLEAN_FLAGS.get(arg)] = true;
			continue;
		}

		throw new CliUsageError(`Unknown argument: ${arg}`);
	}

	return options;
}

function unquote(value) {
	const quote = value[0];
	if (value.length >= 2 && (quote === '"' || quote === "'") && value.endsWith(quote)) {
		return value.slice(1, -1);
	}
	return value;
}

/**
 * Loads `KEY=value` lines into process.env without replacing variables that are already set.
 * A missing file is skipped unless `required` (an explicit `--env <file>`), which throws.
 */
export function loadEnvFile(name, { required = false } = {}) {
	const path = resolve(ROOT, name);
	let content;
	try {
		content = readFileSync(path, "utf8");
	} catch (error) {
		if (required) {
			throw new CliUsageError(`Cannot read env file ${path} (${error.code ?? error.message})`);
		}
		return false;
	}

	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eq = trimmed.indexOf("=");
		if (eq === -1) continue;
		const key = trimmed
			.slice(0, eq)
			.replace(/^export\s+/, "")
			.trim();
		// Quotes are how dotenv files (and the Configurator's) usually write values.
		const value = unquote(trimmed.slice(eq + 1).trim());
		if (!(key in process.env)) process.env[key] = value;
	}
	return true;
}

/** Loads the env file named by `--env`, or the default pair when there is none. */
export function loadEnvFromArgs(argv = process.argv.slice(2), parseOptions) {
	const { envFile } = parseCatalogCliArgs(argv, parseOptions);
	if (envFile) {
		loadEnvFile(envFile, { required: true });
		return;
	}
	loadEnvFile(".env.local");
	loadEnvFile(".env.configurator.local");
}

export function getSaleorCredentials() {
	// An empty `KEY=` line counts as not set.
	const apiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL?.trim() || undefined;
	const token = process.env.SALEOR_CONFIGURATOR_TOKEN?.trim() || undefined;
	return { apiUrl, token };
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseIntEnv(name, fallback) {
	const raw = process.env[name];
	if (raw == null || raw.trim() === "") return fallback;
	const parsed = Number.parseInt(raw, 10);
	return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Throttle/retry config — mirrors src/lib/saleor/client.ts so catalog scripts respect the same
 * env knobs as the storefront. Defaults are deliberately gentle so a deploy can never
 * stampede a Saleor instance.
 */
export function getThrottleConfig() {
	const buildRetries = process.env.NEXT_BUILD_RETRIES;
	return {
		maxConcurrent: Math.max(1, parseIntEnv("SALEOR_MAX_CONCURRENT_REQUESTS", 3)),
		minDelayMs: Math.max(0, parseIntEnv("SALEOR_MIN_REQUEST_DELAY_MS", 200)),
		timeoutMs: Math.max(1000, parseIntEnv("SALEOR_REQUEST_TIMEOUT_MS", 15000)),
		maxRetries: buildRetries !== undefined ? Math.max(0, parseIntEnv("NEXT_BUILD_RETRIES", 3)) : 3,
		retryDelayMs: 1000,
	};
}

// Caps in-flight requests and spaces request starts by minDelayMs. A single shared queue
// across the whole process means reads, the permission probe, and writes all share the budget.
class RequestQueue {
	constructor(maxConcurrent, minDelayMs) {
		this.queue = [];
		this.active = 0;
		this.maxConcurrent = maxConcurrent;
		this.minDelayMs = minDelayMs;
	}

	async enqueue(fn) {
		// The slot is taken in the same tick as the check. With an `await` in between, every
		// caller of one Promise.all saw a free slot and the cap was never applied.
		if (this.active < this.maxConcurrent) {
			this.active++;
		} else {
			// A finishing request hands its slot over, so `active` stays as it is.
			await new Promise((resolve) => this.queue.push(resolve));
		}
		try {
			const [result] = await Promise.all([fn(), sleep(this.minDelayMs)]);
			return result;
		} finally {
			const next = this.queue.shift();
			if (next) next();
			else this.active--;
		}
	}
}

let sharedQueue = null;
function getSharedQueue() {
	if (!sharedQueue) {
		const { maxConcurrent, minDelayMs } = getThrottleConfig();
		sharedQueue = new RequestQueue(maxConcurrent, minDelayMs);
	}
	return sharedQueue;
}

async function fetchWithTimeout(url, init, timeoutMs) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		return await fetch(url, { ...init, signal: controller.signal });
	} finally {
		clearTimeout(timer);
	}
}

export function createGqlClient(apiUrl, token) {
	const { timeoutMs, maxRetries, retryDelayMs } = getThrottleConfig();
	const queue = getSharedQueue();

	async function send(query, variables) {
		for (let attempt = 0; ; attempt++) {
			let response;
			try {
				response = await fetchWithTimeout(
					apiUrl,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ query, variables }),
					},
					timeoutMs,
				);
			} catch (error) {
				const isTimeout = error?.name === "AbortError";
				if (attempt < maxRetries) {
					await sleep(retryDelayMs * 2 ** attempt);
					continue;
				}
				throw new Error(
					isTimeout
						? `Saleor request timed out after ${timeoutMs}ms (raise SALEOR_REQUEST_TIMEOUT_MS if needed)`
						: `Network error reaching Saleor: ${error?.message ?? error}`,
				);
			}

			// Back off on rate limiting / server errors, honoring Retry-After when present.
			if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
				const retryAfter = Number.parseInt(response.headers.get("Retry-After") ?? "", 10);
				const delay = Number.isFinite(retryAfter) ? retryAfter * 1000 : retryDelayMs * 2 ** attempt;
				console.warn(
					`[catalog] Saleor HTTP ${response.status} — retrying in ${delay}ms (attempt ${
						attempt + 1
					}/${maxRetries})`,
				);
				await sleep(delay);
				continue;
			}

			if (!response.ok) {
				const body = await response.text().catch(() => "");
				throw new Error(
					`Saleor HTTP ${response.status} ${response.statusText}${body ? `\n${body.slice(0, 500)}` : ""}`,
				);
			}

			const json = await response.json();
			if (json.errors?.length) {
				throw new Error(json.errors.map((error) => error.message).join("\n"));
			}
			return json.data;
		}
	}

	return (query, variables) => queue.enqueue(() => send(query, variables));
}

// Catalog translations can run under either a staff-user token (me.userPermissions)
// or an app token (app.permissions). Check both so we never reject a valid token.
const TRANSLATION_PERMISSIONS_QUERY = /* GraphQL */ `
	query CatalogTranslationPermissions {
		me {
			userPermissions {
				code
			}
		}
		app {
			permissions {
				code
			}
		}
	}
`;

export async function assertTranslationPermissions(gql) {
	let data;
	try {
		data = await gql(TRANSLATION_PERMISSIONS_QUERY);
	} catch (error) {
		throw new Error(
			`[catalog] Could not verify token permissions: ${error.message}. ` +
				"Set SALEOR_CONFIGURATOR_TOKEN to a staff or app token with MANAGE_TRANSLATIONS.",
		);
	}

	const permissions = new Set([
		...(data.me?.userPermissions?.map((entry) => entry.code) ?? []),
		...(data.app?.permissions?.map((entry) => entry.code) ?? []),
	]);

	if (!data.me && !data.app) {
		throw new Error(
			"[catalog] Token resolves to neither a staff user nor an app. " +
				"Set SALEOR_CONFIGURATOR_TOKEN to a token with MANAGE_TRANSLATIONS.",
		);
	}

	const missing = REQUIRED_PERMISSIONS.filter((code) => !permissions.has(code));
	if (missing.length > 0) {
		throw new Error(
			`[catalog] Token missing permissions: ${missing.join(", ")}. ` +
				"Grant MANAGE_TRANSLATIONS to this staff user or app.",
		);
	}
}

const HTML_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

/** Tags out, entities decoded. Saleor stores `&`, `<` and `>` in EditorJS text as entities. */
function stripMarkup(text) {
	return String(text)
		.replace(/<[^>]+>/g, "")
		.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
			if (entity[0] !== "#") return HTML_ENTITIES[entity.toLowerCase()] ?? match;
			const code =
				entity[1].toLowerCase() === "x"
					? Number.parseInt(entity.slice(2), 16)
					: Number.parseInt(entity.slice(1), 10);
			return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
		})
		.trim();
}

function escapeMarkup(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Text of one EditorJS block: paragraphs, headers and quotes carry `text`, lists carry `items`. */
function blockText(block) {
	const data = block?.data ?? {};
	const parts = [];
	if (typeof data.text === "string") parts.push(data.text);

	const collectItems = (items) => {
		for (const item of Array.isArray(items) ? items : []) {
			if (typeof item === "string") {
				parts.push(item);
			} else if (item && typeof item === "object") {
				// Nested lists (EditorJS 2.30+) and checklists.
				if (typeof item.content === "string") parts.push(item.content);
				else if (typeof item.text === "string") parts.push(item.text);
				collectItems(item.items);
			}
		}
	};
	collectItems(data.items);

	return parts.map(stripMarkup).filter(Boolean).join("\n");
}

/**
 * Strip HTML and flatten EditorJS JSON to plain text for fixtures. Blocks are separated by a
 * blank line, which plainToEditorJs turns back into blocks.
 */
export function editorJsToPlain(value) {
	if (value == null || value === "") return null;
	if (typeof value !== "string") return String(value);

	const trimmed = value.trim();
	if (!trimmed.startsWith("{")) {
		return stripMarkup(trimmed) || null;
	}

	try {
		const parsed = JSON.parse(trimmed);
		const text = (parsed.blocks ?? []).map(blockText).filter(Boolean).join("\n\n");
		return text || null;
	} catch {
		return stripMarkup(trimmed) || null;
	}
}

/**
 * Convert fixture plain text to Saleor EditorJS JSON: one paragraph block per paragraph (blank
 * lines separate them). The text is escaped, so `&` and `<` in copy are stored as characters
 * instead of being read as markup.
 */
export function plainToEditorJs(text, version = "2.22.2") {
	const paragraphs = String(text)
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);
	if (paragraphs.length === 0) return null;
	return JSON.stringify({
		time: Date.now(),
		blocks: paragraphs.map((paragraph, index) => ({
			id: index === 0 ? "fixture" : `fixture-${index + 1}`,
			data: { text: escapeMarkup(paragraph) },
			type: "paragraph",
		})),
		version,
	});
}

export function normalizeOptionalString(value) {
	if (value == null) return null;
	const trimmed = String(value).trim();
	return trimmed.length > 0 ? trimmed : null;
}

/** Saleor's limit for AttributeValueTranslation.name; a longer name is a validation error. */
const ATTRIBUTE_VALUE_NAME_MAX = 250;

/** Per-product attribute values — PLAIN_TEXT uses plainText; RICH_TEXT also needs EditorJS richText. */
export function buildProductAttributeValueInput(text, inputType = "PLAIN_TEXT") {
	const normalized = normalizeOptionalString(text);
	if (!normalized) return null;

	// `name` is only a label for the value; the full text travels in plainText / richText.
	const flat = normalized.replace(/\s+/g, " ");
	const name =
		flat.length > ATTRIBUTE_VALUE_NAME_MAX ? `${flat.slice(0, ATTRIBUTE_VALUE_NAME_MAX - 1)}…` : flat;
	const input = { name, plainText: normalized };
	if (inputType === "RICH_TEXT") {
		input.richText = plainToEditorJs(normalized, "2.30.7");
	}
	return input;
}

function mergeAttributes(existing = {}, incoming = {}) {
	const merged = { ...existing };
	for (const [slug, attribute] of Object.entries(incoming)) {
		merged[slug] = {
			...merged[slug],
			...attribute,
			values: {
				...merged[slug]?.values,
				...attribute?.values,
			},
		};
	}
	return merged;
}

function mergeProductAttributes(existing = {}, incoming = {}) {
	const merged = { ...existing };
	for (const [productSlug, attributes] of Object.entries(incoming)) {
		merged[productSlug] = {
			...merged[productSlug],
			...attributes,
		};
	}
	return merged;
}

export function assertValidLanguageCode(languageCode, fixtureName) {
	if (!languageCode) {
		throw new Error(`Invalid fixture ${fixtureName}: expected languageCode`);
	}
	if (RESERVED_LANGUAGE_CODES.has(languageCode)) {
		throw new Error(
			`Invalid fixture ${fixtureName}: languageCode ${languageCode} is reserved. English is the default catalog language in Saleor — only translate non-default locales.`,
		);
	}
}

export function loadLocaleFixtureFiles(dir = CATALOG_LOCALES_DIR) {
	if (!existsSync(dir)) {
		return [];
	}

	const files = readdirSync(dir)
		.filter(
			(name) =>
				(name.endsWith(".yaml") || name.endsWith(".yml")) &&
				name !== "catalog-source.yaml" &&
				!name.startsWith("."),
		)
		.sort();

	const byLanguageCode = new Map();
	for (const name of files) {
		const fixture = parse(readFileSync(resolve(dir, name), "utf8"));
		assertValidLanguageCode(fixture?.languageCode, name);

		const existing = byLanguageCode.get(fixture.languageCode) ?? {
			languageCode: fixture.languageCode,
			names: [],
		};
		byLanguageCode.set(fixture.languageCode, {
			languageCode: fixture.languageCode,
			names: [...existing.names, name],
			categories: { ...existing.categories, ...fixture.categories },
			collections: { ...existing.collections, ...fixture.collections },
			products: { ...existing.products, ...fixture.products },
			attributes: mergeAttributes(existing.attributes, fixture.attributes),
			productAttributes: mergeProductAttributes(existing.productAttributes, fixture.productAttributes),
		});
	}

	return [...byLanguageCode.values()].map((fixture) => ({
		name: fixture.names.join(" + "),
		...fixture,
	}));
}

/** Where the locale fixtures and catalog-source.json live: `--locales <dir>` or the default. */
export function resolveLocalesDir(localesDir) {
	const dir = localesDir ? resolve(ROOT, localesDir) : CATALOG_LOCALES_DIR;
	return { dir, sourceFile: localesDir ? resolve(dir, "catalog-source.json") : CATALOG_SOURCE_FILE };
}

/**
 * All choices of an attribute. The attribute query brings the first page together with its
 * pageInfo; `moreChoicesQuery` (variables `$id`, `$after`, plus `variables`) brings the rest.
 * Without this, values past the first 100 looked unknown.
 */
export async function loadAllChoices(gql, attribute, moreChoicesQuery, variables = {}) {
	const nodes = attribute.choices.edges.map((edge) => edge.node);
	let { hasNextPage, endCursor } = attribute.choices.pageInfo ?? {};
	while (hasNextPage) {
		const data = await gql(moreChoicesQuery, { ...variables, id: attribute.id, after: endCursor });
		const page = data.attribute.choices;
		nodes.push(...page.edges.map((edge) => edge.node));
		({ hasNextPage, endCursor } = page.pageInfo);
	}
	return nodes;
}

export function loadCatalogSourceSnapshot(file = CATALOG_SOURCE_FILE) {
	if (!existsSync(file)) {
		return null;
	}
	return JSON.parse(readFileSync(file, "utf8"));
}

/** Entity translation fields compared/written per category, collection, and product. */
export const ENTITY_TRANSLATION_FIELDS = ["name", "description", "seoTitle", "seoDescription", "slug"];

/**
 * Semantic (plain-text) equality — descriptions are stored as EditorJS, so compare flattened
 * text. Whitespace runs count as one space: where a paragraph or line breaks is not a difference
 * in the copy, and Saleor may hand the same text back in other blocks than it was sent in.
 */
function fieldsEqual(existingPlain, desiredPlain) {
	const flatten = (value) => normalizeOptionalString(value)?.replace(/\s+/g, " ") ?? null;
	return flatten(existingPlain) === flatten(desiredPlain);
}

/**
 * Build a deploy plan, comparing each fixture field against the existing Saleor translation.
 *
 * Buckets:
 *  - applied:    new fields, plus differing fields when { overwrite: true }
 *  - skipped:    data errors (unknown slug, empty value) — these gate --fail-on-skip
 *  - protected:  existing translation differs and would be overwritten, but --overwrite was not set
 *  - unchanged:  fixture matches what is already in Saleor (count only)
 *
 * `existing` is the per-locale snapshot returned by the deploy script's loaders; an empty
 * snapshot (no existing translations) makes every field "new".
 */
export function planFixtureTranslations(fixture, indexes, existing = {}, options = {}) {
	const overwrite = options.overwrite ?? false;
	const languageCode = fixture.languageCode;
	const applied = [];
	const skipped = [];
	const protectedEntries = [];
	let unchanged = 0;

	const classifyField = ({ kind, slug, desiredPlain, existingPlain, onWrite }) => {
		if (normalizeOptionalString(existingPlain) == null) {
			onWrite();
			return "new";
		}
		if (fieldsEqual(existingPlain, desiredPlain)) {
			unchanged++;
			return "unchanged";
		}
		if (overwrite) {
			onWrite();
			return "overwrite";
		}
		protectedEntries.push({ kind, slug, reason: "existing translation differs (use --overwrite)" });
		return "protected";
	};

	const planEntitySection = (label, fixtureSection, slugIndex, existingMap, mutation) => {
		for (const [slug, fields] of Object.entries(fixtureSection ?? {})) {
			const id = slugIndex.get(slug);
			if (!id) {
				skipped.push({ kind: label, slug, reason: `unknown ${label} in Saleor` });
				continue;
			}

			// `some-slug:` with nothing under it parses to null.
			if (fields == null || typeof fields !== "object") {
				skipped.push({ kind: label, slug, reason: "empty fixture entry" });
				continue;
			}

			const existingFields = existingMap?.get(slug);
			const input = {};
			let hasOverwrite = false;

			for (const key of ENTITY_TRANSLATION_FIELDS) {
				if (!(key in fields)) continue;
				const desired = normalizeOptionalString(fields[key]);
				if (desired == null) continue;

				const outcome = classifyField({
					kind: label,
					slug: `${slug}.${key}`,
					desiredPlain: desired,
					existingPlain: existingFields ? existingFields[key] : null,
					onWrite: () => {
						input[key] = key === "description" ? plainToEditorJs(desired) : desired;
					},
				});
				if (outcome === "overwrite") hasOverwrite = true;
			}

			if (Object.keys(input).length === 0) continue;
			applied.push({
				kind: label,
				slug,
				languageCode,
				mutation,
				id,
				input,
				change: hasOverwrite ? "overwrite" : "new",
			});
		}
	};

	planEntitySection(
		"category",
		fixture.categories,
		indexes.categoryIndex,
		existing.categories,
		"categoryTranslate",
	);
	planEntitySection(
		"collection",
		fixture.collections,
		indexes.collectionIndex,
		existing.collections,
		"collectionTranslate",
	);
	planEntitySection("product", fixture.products, indexes.productIndex, existing.products, "productTranslate");

	for (const [attributeSlug, fields] of Object.entries(fixture.attributes ?? {})) {
		const attribute = indexes.attributeIndex.get(attributeSlug);
		if (!attribute) {
			skipped.push({ kind: "attribute", slug: attributeSlug, reason: "unknown attribute in Saleor" });
			continue;
		}
		const existingAttr = existing.attributes?.get(attributeSlug);

		const desiredName = normalizeOptionalString(fields?.name);
		if (desiredName != null) {
			classifyField({
				kind: "attribute",
				slug: `${attributeSlug}.name`,
				desiredPlain: desiredName,
				existingPlain: existingAttr?.name ?? null,
				onWrite: () => {
					applied.push({
						kind: "attribute",
						slug: attributeSlug,
						languageCode,
						mutation: "attributeTranslate",
						id: attribute.id,
						input: { name: desiredName },
						change: normalizeOptionalString(existingAttr?.name) == null ? "new" : "overwrite",
					});
				},
			});
		}

		for (const [valueSlug, valueName] of Object.entries(fields?.values ?? {})) {
			const valueId = attribute.values.get(valueSlug);
			if (!valueId) {
				skipped.push({
					kind: "attribute-value",
					slug: `${attributeSlug}.${valueSlug}`,
					reason: "unknown attribute value in Saleor",
				});
				continue;
			}
			const desiredValue = normalizeOptionalString(valueName);
			if (desiredValue == null) {
				skipped.push({
					kind: "attribute-value",
					slug: `${attributeSlug}.${valueSlug}`,
					reason: "empty value name",
				});
				continue;
			}
			const existingValue = existingAttr?.values?.get(valueSlug) ?? null;
			classifyField({
				kind: "attribute-value",
				slug: `${attributeSlug}.${valueSlug}`,
				desiredPlain: desiredValue,
				existingPlain: existingValue,
				onWrite: () => {
					applied.push({
						kind: "attribute-value",
						slug: `${attributeSlug}.${valueSlug}`,
						languageCode,
						mutation: "attributeValueTranslate",
						id: valueId,
						input: { name: desiredValue },
						change: normalizeOptionalString(existingValue) == null ? "new" : "overwrite",
					});
				},
			});
		}
	}

	for (const [productSlug, attributes] of Object.entries(fixture.productAttributes ?? {})) {
		const productAttributes = indexes.productAttributeIndex.get(productSlug);
		if (!productAttributes) {
			for (const attributeSlug of Object.keys(attributes ?? {})) {
				skipped.push({
					kind: "product-attribute",
					slug: `${productSlug}.${attributeSlug}`,
					reason: "unknown product or product has no text attributes in Saleor",
				});
			}
			continue;
		}

		for (const [attributeSlug, text] of Object.entries(attributes ?? {})) {
			const valueId = productAttributes.get(attributeSlug);
			if (!valueId) {
				skipped.push({
					kind: "product-attribute",
					slug: `${productSlug}.${attributeSlug}`,
					reason: "unknown product attribute in Saleor",
				});
				continue;
			}
			const desired = normalizeOptionalString(text);
			if (desired == null) {
				skipped.push({
					kind: "product-attribute",
					slug: `${productSlug}.${attributeSlug}`,
					reason: "empty attribute text",
				});
				continue;
			}
			const inputType = indexes.attributeIndex.get(attributeSlug)?.inputType ?? "PLAIN_TEXT";
			// A translation made in the Dashboard for a RICH_TEXT attribute has richText only.
			const existingEntry = existing.productAttributes?.get(`${productSlug}.${attributeSlug}`);
			const existingValue =
				normalizeOptionalString(existingEntry?.plainText) ?? editorJsToPlain(existingEntry?.richText) ?? null;
			classifyField({
				kind: "product-attribute",
				slug: `${productSlug}.${attributeSlug}`,
				desiredPlain: desired,
				existingPlain: existingValue,
				onWrite: () => {
					applied.push({
						kind: "product-attribute",
						slug: `${productSlug}.${attributeSlug}`,
						languageCode,
						mutation: "attributeValueTranslate",
						id: valueId,
						input: buildProductAttributeValueInput(desired, inputType),
						change: normalizeOptionalString(existingValue) == null ? "new" : "overwrite",
					});
				},
			});
		}
	}

	return { applied, skipped, protected: protectedEntries, unchanged };
}

export function reportFixtureCoverage(fixture, indexes, snapshot) {
	const sections = [
		["categories", fixture.categories, indexes.categoryIndex],
		["collections", fixture.collections, indexes.collectionIndex],
		["products", fixture.products, indexes.productIndex],
		["attributes", fixture.attributes, indexes.attributeIndex],
	];

	const lines = [];
	for (const [label, fixtureSection, liveIndex] of sections) {
		const slugs = Object.keys(fixtureSection ?? {});
		if (slugs.length === 0) continue;
		const missing = slugs.filter((slug) => !liveIndex.has(slug));
		const snapshotSection = snapshot?.[label];
		const missingFromSnapshot = snapshotSection ? missing.filter((slug) => !(slug in snapshotSection)) : [];
		lines.push(
			`  ${label}: ${slugs.length - missing.length}/${slugs.length} matched in Saleor` +
				(missing.length > 0 ? ` — missing: ${missing.join(", ")}` : "") +
				(missingFromSnapshot.length > 0
					? ` (not in catalog-source.json: ${missingFromSnapshot.join(", ")})`
					: ""),
		);
	}

	return lines;
}

export function summarizeSkipped(skipped) {
	const counts = new Map();
	for (const entry of skipped) {
		counts.set(entry.reason, (counts.get(entry.reason) ?? 0) + 1);
	}
	return [...counts.entries()].map(([reason, count]) => `  ${count}× ${reason}`);
}
