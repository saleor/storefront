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

export function parseCatalogCliArgs(argv = process.argv.slice(2)) {
	const envFlagIndex = argv.indexOf("--env");
	const envFile = envFlagIndex === -1 ? null : argv[envFlagIndex + 1];

	return {
		dryRun: argv.includes("--dry-run"),
		failOnSkip: argv.includes("--fail-on-skip"),
		allowSkip: argv.includes("--allow-skip"),
		overwrite: argv.includes("--overwrite"),
		envFile,
	};
}

export function loadEnvFile(name) {
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

export function loadEnvFromArgs(argv = process.argv.slice(2)) {
	const { envFile } = parseCatalogCliArgs(argv);
	if (envFile) {
		loadEnvFile(envFile);
		return;
	}
	loadEnvFile(".env.local");
	loadEnvFile(".env.configurator.local");
}

export function getSaleorCredentials() {
	const apiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
	const token = process.env.SALEOR_CONFIGURATOR_TOKEN;
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
 * Throttle/retry config — mirrors src/lib/graphql.ts so catalog scripts respect the same
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
		await this.waitForSlot();
		this.active++;
		try {
			const [result] = await Promise.all([fn(), sleep(this.minDelayMs)]);
			return result;
		} finally {
			this.active--;
			this.processQueue();
		}
	}

	waitForSlot() {
		if (this.active < this.maxConcurrent) return Promise.resolve();
		return new Promise((resolve) => this.queue.push(resolve));
	}

	processQueue() {
		if (this.queue.length > 0 && this.active < this.maxConcurrent) {
			this.queue.shift()?.();
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

/** Strip HTML and flatten EditorJS JSON to plain text for fixtures. */
export function editorJsToPlain(value) {
	if (value == null || value === "") return null;
	if (typeof value !== "string") return String(value);

	const trimmed = value.trim();
	if (!trimmed.startsWith("{")) {
		return trimmed.replace(/<[^>]+>/g, "").trim() || null;
	}

	try {
		const parsed = JSON.parse(trimmed);
		const text = parsed.blocks
			?.map((block) =>
				block.data?.text
					?.replace(/<[^>]+>/g, "")
					.replace(/&nbsp;/g, " ")
					.trim(),
			)
			.filter(Boolean)
			.join(" ");
		return text || null;
	} catch {
		return trimmed.replace(/<[^>]+>/g, "").trim() || null;
	}
}

/** Convert fixture plain text to Saleor EditorJS JSON. */
export function plainToEditorJs(text, version = "2.22.2") {
	const normalized = String(text).trim();
	if (!normalized) return null;
	return JSON.stringify({
		time: Date.now(),
		blocks: [{ id: "fixture", data: { text: normalized }, type: "paragraph" }],
		version,
	});
}

export function normalizeOptionalString(value) {
	if (value == null) return null;
	const trimmed = String(value).trim();
	return trimmed.length > 0 ? trimmed : null;
}

/** Per-product attribute values — PLAIN_TEXT uses plainText; RICH_TEXT also needs EditorJS richText. */
export function buildProductAttributeValueInput(text, inputType = "PLAIN_TEXT") {
	const normalized = normalizeOptionalString(text);
	if (!normalized) return null;

	const input = { name: normalized, plainText: normalized };
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

export function loadCatalogSourceSnapshot() {
	if (!existsSync(CATALOG_SOURCE_FILE)) {
		return null;
	}
	return JSON.parse(readFileSync(CATALOG_SOURCE_FILE, "utf8"));
}

/** Entity translation fields compared/written per category, collection, and product. */
export const ENTITY_TRANSLATION_FIELDS = ["name", "description", "seoTitle", "seoDescription", "slug"];

/** Semantic (plain-text) equality — descriptions are stored as EditorJS, so compare flattened text. */
function fieldsEqual(existingPlain, desiredPlain) {
	return normalizeOptionalString(existingPlain) === normalizeOptionalString(desiredPlain);
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
			for (const attributeSlug of Object.keys(attributes)) {
				skipped.push({
					kind: "product-attribute",
					slug: `${productSlug}.${attributeSlug}`,
					reason: "unknown product or product has no text attributes in Saleor",
				});
			}
			continue;
		}

		for (const [attributeSlug, text] of Object.entries(attributes)) {
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
			const existingValue =
				existing.productAttributes?.get(`${productSlug}.${attributeSlug}`)?.plainText ?? null;
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
