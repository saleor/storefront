import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { stringify } from "yaml";
import { connection, runScript, startFakeSaleor } from "./test-support/saleor-script-harness.mjs";

const TIMEOUT = 30_000;
const editorJs = (...blocks) => JSON.stringify({ blocks });
const paragraph = (text) => ({ type: "paragraph", data: { text } });

/** Color has more values than one page of `choices(first: 100)` holds. */
const COLOR_VALUES = Array.from({ length: 150 }, (_, index) => ({
	id: `AV${index + 1}`,
	slug: `color-${index + 1}`,
	name: `Color ${index + 1}`,
}));

let fake;
afterEach(async () => {
	await fake?.close();
	fake = undefined;
});

/**
 * A small catalog that keeps the translations it is sent, so a second run sees the first.
 * `translations` seeds existing ones (`"<LANG>:<id>"` → fields); ids in `rejected` get a
 * validation error; `failWritesAfter` makes every write after that many fail outright.
 */
async function startCatalog({
	permissions = ["MANAGE_TRANSLATIONS"],
	translations = {},
	rejected = [],
	failWritesAfter,
} = {}) {
	const stored = new Map(Object.entries(translations));
	const writes = [];
	const translation = (id, language) => stored.get(`${language}:${id}`) ?? null;

	const categories = [
		{
			id: "C1",
			slug: "shoes",
			name: "Shoes",
			description: editorJs(paragraph("Built to last."), paragraph("Sizes 36 &amp; up.")),
			seoTitle: null,
			seoDescription: null,
		},
	];
	const products = [
		{
			id: "P1",
			slug: "runner",
			name: "Runner",
			description: editorJs(paragraph("A light shoe.")),
			seoTitle: null,
			seoDescription: null,
			category: { slug: "shoes" },
			attributes: [
				{
					attribute: { slug: "material", inputType: "PLAIN_TEXT" },
					values: [{ id: "V-material", name: "Mesh upper", plainText: "Mesh upper", richText: null }],
				},
				{
					attribute: { slug: "care", inputType: "RICH_TEXT" },
					values: [
						{
							id: "V-care",
							name: "Wipe clean",
							plainText: null,
							richText: editorJs(paragraph("Wipe clean."), paragraph("Do not tumble dry.")),
						},
					],
				},
			],
		},
	];
	const attributes = [
		{ id: "A-color", slug: "color", name: "Color", inputType: "DROPDOWN", values: COLOR_VALUES },
		{ id: "A-material", slug: "material", name: "Material", inputType: "PLAIN_TEXT", values: [] },
		{ id: "A-care", slug: "care", name: "Care", inputType: "RICH_TEXT", values: [] },
	];

	const choices = (attribute, after, language) => {
		const start = after ? Number(after) : 0;
		const page = attribute.values.slice(start, start + 100);
		return {
			pageInfo: { hasNextPage: start + 100 < attribute.values.length, endCursor: String(start + 100) },
			edges: page.map((value) => ({ node: { ...value, translation: translation(value.id, language) } })),
		};
	};
	const withTranslation = (nodes, language) =>
		connection(nodes.map((node) => ({ ...node, translation: translation(node.id, language) })));

	fake = await startFakeSaleor(({ operation, variables }) => {
		const language = variables.languageCode;
		switch (operation) {
			case "CatalogTranslationPermissions":
				return { me: null, app: { permissions: permissions.map((code) => ({ code })) } };
			case "ListCategoryIds":
			case "ListCategories":
			case "ExistingCategoryTranslations":
				return { categories: withTranslation(categories, language) };
			case "ListCollectionIds":
			case "ListCollections":
			case "ExistingCollectionTranslations":
				return { collections: connection([]) };
			case "ListProductIds":
			case "ListProductAttributeIds":
			case "ListProducts":
			case "ExistingProductTranslations":
				return {
					products: connection(
						products.map((product) => ({
							...product,
							translation: translation(product.id, language),
							attributes: product.attributes.map((assignment) => ({
								...assignment,
								values: assignment.values.map((value) => ({
									...value,
									translation: translation(value.id, language),
								})),
							})),
						})),
					),
				};
			case "ListAttributeIds":
			case "ListAttributes":
			case "ExistingAttributeTranslations":
				return {
					attributes: connection(
						attributes.map((attribute) => ({
							...attribute,
							translation: translation(attribute.id, language),
							choices: choices(attribute, null, language),
						})),
					),
				};
			case "MoreAttributeChoiceIds":
			case "MoreAttributeChoices":
			case "MoreExistingChoiceTranslations": {
				const attribute = attributes.find((entry) => entry.id === variables.id);
				return { attribute: { choices: choices(attribute, variables.after, language) } };
			}
			case "CategoryTranslate":
			case "CollectionTranslate":
			case "ProductTranslate":
			case "AttributeTranslate":
			case "AttributeValueTranslate": {
				if (failWritesAfter != null && writes.length >= failWritesAfter) {
					return { status: 503, body: "Service Unavailable" };
				}
				const field = operation[0].toLowerCase() + operation.slice(1);
				if (rejected.includes(variables.id)) {
					return {
						[field]: { errors: [{ field: "name", message: "Ensure this value is valid.", code: "INVALID" }] },
					};
				}
				writes.push({ operation, ...variables });
				const key = `${language}:${variables.id}`;
				stored.set(key, { ...stored.get(key), ...variables.input });
				return { [field]: { errors: [] } };
			}
			default:
				throw new Error(`The fake has no answer for ${operation}`);
		}
	});

	return { writes, stored, requests: fake.requests };
}

/** A locales directory with one fixture file; returns its path. */
function localesDir(fixture) {
	const dir = mkdtempSync(join(tmpdir(), "catalog-locales-"));
	if (fixture) writeFileSync(join(dir, "pl.yaml"), stringify({ languageCode: "PL", ...fixture }));
	return dir;
}

const run = (script, args, dir) =>
	runScript(script, [...args, "--locales", dir], {
		apiUrl: fake.url,
		env: { SALEOR_CONFIGURATOR_TOKEN: "configurator-token" },
	});
const deploy = (args, dir) => run("deploy-catalog-translations.mjs", args, dir);

const FIXTURE = {
	categories: { shoes: { name: "Buty", description: "Zrobione, by służyć.\n\nRozmiary 36 & większe." } },
	products: { runner: { name: "Biegacz" } },
	attributes: { color: { name: "Kolor", values: { "color-1": "Kolor 1", "color-120": "Kolor 120" } } },
	productAttributes: { runner: { material: "Cholewka z siatki" } },
};

describe("deploy-catalog-translations", () => {
	it(
		"stops on a mistyped flag before any request",
		async () => {
			const catalog = await startCatalog();
			const result = await deploy(["--dryrun"], localesDir(FIXTURE));

			expect(result.code).toBe(1);
			expect(result.stderr).toContain("Unknown argument: --dryrun");
			expect(catalog.requests).toHaveLength(0);
		},
		TIMEOUT,
	);

	it(
		"stops when the --env file cannot be read",
		async () => {
			const catalog = await startCatalog();
			const result = await deploy(
				["--dry-run", "--env", join(tmpdir(), "no-such-dir", ".env.staging")],
				localesDir(FIXTURE),
			);

			expect(result.code).toBe(1);
			expect(result.stderr).toContain("Cannot read env file");
			expect(catalog.requests).toHaveLength(0);
		},
		TIMEOUT,
	);

	it(
		"plans without writing, then deploys, and a second run finds everything unchanged",
		async () => {
			const catalog = await startCatalog();
			const dir = localesDir(FIXTURE);

			const plan = await deploy(["--dry-run", "--fail-on-skip"], dir);
			expect(plan.code).toBe(0);
			expect(plan.stdout).toContain("6 would apply (6 new, 0 overwrite)");
			expect(catalog.writes).toHaveLength(0);

			const first = await deploy(["--fail-on-skip"], dir);
			expect(first.code).toBe(0);
			expect(first.stdout).toContain("Done — 6 applied (6 new, 0 overwrite)");
			// A value past the first page of choices is found; it used to be "unknown".
			expect(catalog.writes.map((write) => write.id)).toContain("AV120");

			// Paragraphs become blocks, and `&` is stored as an entity, as Saleor would store it.
			const description = JSON.parse(catalog.stored.get("PL:C1").description);
			expect(description.blocks.map((block) => block.data.text)).toEqual([
				"Zrobione, by służyć.",
				"Rozmiary 36 &amp; większe.",
			]);

			const second = await deploy(["--fail-on-skip"], dir);
			expect(second.code).toBe(0);
			expect(second.stdout).toContain("Done — 0 applied (0 new, 0 overwrite), 7 unchanged, 0 protected");
			expect(catalog.writes).toHaveLength(6);
		},
		TIMEOUT,
	);

	it(
		"leaves alone translations made elsewhere that hold no plain text",
		async () => {
			const catalog = await startCatalog({
				translations: {
					// RICH_TEXT attribute translated in the Dashboard: richText and a name, no plainText.
					"PL:V-care": {
						name: "Czyścić",
						plainText: null,
						richText: editorJs(paragraph("Czyścić wilgotną szmatką.")),
					},
					// A description that is only a list.
					"PL:P1": {
						name: "Biegacz",
						description: editorJs({ type: "list", data: { style: "unordered", items: ["Lekki", "Szybki"] } }),
					},
				},
			});
			const dir = localesDir({
				products: { runner: { name: "Biegacz", description: "Lekki but do biegania." } },
				productAttributes: { runner: { care: "Prać w pralce." } },
			});

			const result = await deploy(["--fail-on-skip"], dir);

			expect(result.code).toBe(0);
			expect(result.stdout).toContain("0 applied (0 new, 0 overwrite), 1 unchanged, 2 protected");
			expect(catalog.writes).toHaveLength(0);

			const overwrite = await deploy(["--fail-on-skip", "--overwrite"], dir);
			expect(overwrite.code).toBe(0);
			expect(catalog.writes.map((write) => write.id).sort()).toEqual(["P1", "V-care"]);
		},
		TIMEOUT,
	);

	it(
		"sends a long product text with a name Saleor accepts",
		async () => {
			const catalog = await startCatalog();
			const text = "Prać w 30 stopniach. ".repeat(20).trim();
			const result = await deploy(
				["--fail-on-skip"],
				localesDir({ productAttributes: { runner: { material: text } } }),
			);

			expect(result.code).toBe(0);
			expect(catalog.writes).toHaveLength(1);
			expect(catalog.writes[0].input.plainText).toBe(text);
			expect(catalog.writes[0].input.name.length).toBeLessThanOrEqual(250);
		},
		TIMEOUT,
	);

	it(
		"writes the rest when Saleor rejects one entry, and exits 1",
		async () => {
			const catalog = await startCatalog({ rejected: ["C1"] });
			const result = await deploy(["--fail-on-skip"], localesDir(FIXTURE));

			expect(result.code).toBe(1);
			expect(result.stderr).toContain("Rejected by Saleor — PL category.shoes");
			expect(result.stderr).toContain("5 applied, 1 rejected");
			expect(catalog.writes).toHaveLength(5);
		},
		TIMEOUT,
	);

	it(
		"stops on a failing instance and says how far it got",
		async () => {
			const catalog = await startCatalog({ failWritesAfter: 2 });
			const result = await deploy(["--fail-on-skip"], localesDir(FIXTURE));

			expect(result.code).toBe(1);
			expect(result.stderr).toContain("Stopped after 2 of 6 writes: Saleor HTTP 503");
			expect(catalog.writes).toHaveLength(2);
		},
		TIMEOUT,
	);

	it(
		"refuses to run without MANAGE_TRANSLATIONS",
		async () => {
			const catalog = await startCatalog({ permissions: ["MANAGE_PRODUCTS"] });
			const result = await deploy(["--fail-on-skip"], localesDir(FIXTURE));

			expect(result.code).toBe(1);
			expect(result.stderr).toContain("MANAGE_TRANSLATIONS");
			expect(catalog.writes).toHaveLength(0);
		},
		TIMEOUT,
	);
});

describe("fetch-catalog-translations", () => {
	it(
		"writes every attribute value, paragraphs, and the full text of rich-text attributes",
		async () => {
			await startCatalog();
			const dir = localesDir(null);
			const result = await run("fetch-catalog-translations.mjs", [], dir);

			expect(result.code).toBe(0);
			const source = JSON.parse(readFileSync(join(dir, "catalog-source.json"), "utf8"));
			expect(Object.keys(source.attributes.color.values)).toHaveLength(150);
			expect(source.categories.shoes.description).toBe("Built to last.\n\nSizes 36 & up.");
			expect(source.productAttributes.runner).toEqual({
				material: "Mesh upper",
				care: "Wipe clean.\n\nDo not tumble dry.",
			});
		},
		TIMEOUT,
	);

	it(
		"rejects the deploy flags it does not take",
		async () => {
			const catalog = await startCatalog();
			const result = await run("fetch-catalog-translations.mjs", ["--dry-run"], localesDir(null));

			expect(result.code).toBe(1);
			expect(result.stderr).toContain("Unknown argument: --dry-run");
			expect(catalog.requests).toHaveLength(0);
		},
		TIMEOUT,
	);
});
