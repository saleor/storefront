import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	CliUsageError,
	buildProductAttributeValueInput,
	createGqlClient,
	editorJsToPlain,
	loadEnvFile,
	parseCatalogCliArgs,
	plainToEditorJs,
	planFixtureTranslations,
} from "./catalog-translations.mjs";

const editorJs = (blocks) => JSON.stringify({ blocks });
const paragraph = (text) => ({ type: "paragraph", data: { text } });

describe("parseCatalogCliArgs", () => {
	it("reads the flags and both spellings of a value option", () => {
		expect(parseCatalogCliArgs(["--dry-run", "--fail-on-skip", "--env", ".env.staging"])).toMatchObject({
			dryRun: true,
			failOnSkip: true,
			allowSkip: false,
			overwrite: false,
			envFile: ".env.staging",
		});
		expect(parseCatalogCliArgs(["--env=.env.staging", "--locales=tmp/locales"])).toMatchObject({
			envFile: ".env.staging",
			localesDir: "tmp/locales",
		});
	});

	it("skips the separator pnpm forwards", () => {
		expect(parseCatalogCliArgs(["--", "--overwrite"]).overwrite).toBe(true);
	});

	it("throws on anything it does not know instead of ignoring it", () => {
		// Each of these used to be ignored, which turned a plan into a deploy or switched instance.
		expect(() => parseCatalogCliArgs(["--dryrun"])).toThrow(CliUsageError);
		expect(() => parseCatalogCliArgs(["--env-file", ".env.staging"])).toThrow("Unknown argument: --env-file");
		expect(() => parseCatalogCliArgs(["--dry-run=false"])).toThrow(CliUsageError);
		expect(() => parseCatalogCliArgs(["extra"])).toThrow(CliUsageError);
	});

	it("throws when a value option has no value", () => {
		expect(() => parseCatalogCliArgs(["--env"])).toThrow("--env needs a value");
		expect(() => parseCatalogCliArgs(["--env", "--dry-run"])).toThrow("--env needs a value");
	});

	it("accepts only the flags the calling script lists", () => {
		expect(() => parseCatalogCliArgs(["--dry-run"], { flags: [] })).toThrow("Unknown argument: --dry-run");
		expect(parseCatalogCliArgs(["--help"], { flags: [] }).help).toBe(true);
	});
});

describe("loadEnvFile", () => {
	const keys = ["CT_TEST_QUOTED", "CT_TEST_SINGLE", "CT_TEST_EXPORTED", "CT_TEST_PLAIN", "CT_TEST_KEPT"];
	afterEach(() => {
		for (const key of keys) delete process.env[key];
	});

	it("strips quotes and `export`, and keeps variables that are already set", () => {
		const file = join(mkdtempSync(join(tmpdir(), "catalog-env-")), ".env.test");
		writeFileSync(
			file,
			[
				"# comment",
				'CT_TEST_QUOTED="https://example.test/graphql/"',
				"CT_TEST_SINGLE='token value'",
				"export CT_TEST_EXPORTED=exported",
				"CT_TEST_PLAIN=a=b",
				"CT_TEST_KEPT=from-file",
			].join("\n"),
		);
		process.env.CT_TEST_KEPT = "from-shell";

		expect(loadEnvFile(file)).toBe(true);
		expect(process.env.CT_TEST_QUOTED).toBe("https://example.test/graphql/");
		expect(process.env.CT_TEST_SINGLE).toBe("token value");
		expect(process.env.CT_TEST_EXPORTED).toBe("exported");
		expect(process.env.CT_TEST_PLAIN).toBe("a=b");
		expect(process.env.CT_TEST_KEPT).toBe("from-shell");
	});

	it("skips a missing default file but fails on a missing --env file", () => {
		const missing = join(tmpdir(), "catalog-env-does-not-exist", ".env");
		expect(loadEnvFile(missing)).toBe(false);
		expect(() => loadEnvFile(missing, { required: true })).toThrow(CliUsageError);
	});
});

describe("EditorJS conversion", () => {
	it("keeps paragraphs apart and decodes the entities Saleor stores", () => {
		const stored = editorJs([paragraph("Hats &amp; caps, <b>all</b> sizes"), paragraph("5 &lt; 6&nbsp;cm")]);
		expect(editorJsToPlain(stored)).toBe("Hats & caps, all sizes\n\n5 < 6 cm");
	});

	it("reads the text of lists, which have no `text`", () => {
		const flat = editorJs([{ type: "list", data: { style: "unordered", items: ["One", "Two"] } }]);
		const nested = editorJs([
			{ type: "list", data: { items: [{ content: "Fruit", items: [{ content: "Apples", items: [] }] }] } },
		]);
		// A description made only of a list used to read as empty, i.e. as "no translation yet".
		expect(editorJsToPlain(flat)).toBe("One\nTwo");
		expect(editorJsToPlain(nested)).toBe("Fruit\nApples");
	});

	it("returns null for nothing and for a document without text", () => {
		expect(editorJsToPlain(null)).toBeNull();
		expect(editorJsToPlain("")).toBeNull();
		expect(editorJsToPlain(editorJs([paragraph("  ")]))).toBeNull();
	});

	it("writes one block per paragraph and escapes markup characters", () => {
		const document = JSON.parse(plainToEditorJs("Soft & warm.\n\nWidth < 20 cm\nstill the second paragraph"));
		expect(document.blocks.map((block) => block.type)).toEqual(["paragraph", "paragraph"]);
		expect(document.blocks.map((block) => block.data.text)).toEqual([
			"Soft &amp; warm.",
			"Width &lt; 20 cm\nstill the second paragraph",
		]);
		expect(new Set(document.blocks.map((block) => block.id)).size).toBe(2);
		expect(plainToEditorJs("   ")).toBeNull();
	});

	it("round-trips text through write and read", () => {
		const text = "Soft & warm.\n\nWidth < 20 cm > 10 cm";
		expect(editorJsToPlain(plainToEditorJs(text))).toBe(text);
	});
});

describe("buildProductAttributeValueInput", () => {
	it("keeps the name within Saleor's 250 characters and the full text in plainText", () => {
		const text = `Machine wash cold.\n${"Do not bleach. ".repeat(30)}`.trim();
		const input = buildProductAttributeValueInput(text);

		expect(input.plainText).toBe(text);
		expect(input.name.length).toBeLessThanOrEqual(250);
		expect(input.name.endsWith("…")).toBe(true);
		expect(input.name).not.toContain("\n");
	});

	it("uses a short text as the name and adds richText for RICH_TEXT", () => {
		expect(buildProductAttributeValueInput("100% cotton")).toEqual({
			name: "100% cotton",
			plainText: "100% cotton",
		});
		const rich = buildProductAttributeValueInput("100% cotton", "RICH_TEXT");
		expect(JSON.parse(rich.richText).blocks[0].data.text).toBe("100% cotton");
	});
});

describe("planFixtureTranslations", () => {
	const indexes = {
		categoryIndex: new Map([["shoes", "C1"]]),
		collectionIndex: new Map(),
		productIndex: new Map([["runner", "P1"]]),
		attributeIndex: new Map([
			["care", { id: "A1", inputType: "RICH_TEXT", values: new Map() }],
			["material", { id: "A2", inputType: "PLAIN_TEXT", values: new Map() }],
		]),
		productAttributeIndex: new Map([
			[
				"runner",
				new Map([
					["care", "V-care"],
					["material", "V-material"],
				]),
			],
		]),
	};
	const fixture = (sections) => ({ languageCode: "PL", ...sections });

	it("protects a rich-text attribute translation that has richText only", () => {
		// What the Dashboard stores for a RICH_TEXT attribute: richText and a name, no plainText.
		const existing = {
			productAttributes: new Map([
				[
					"runner.care",
					{ name: "Prać ręcznie", plainText: null, richText: editorJs([paragraph("Prać ręcznie")]) },
				],
			]),
		};
		const plan = planFixtureTranslations(
			fixture({ productAttributes: { runner: { care: "Prać w pralce" } } }),
			indexes,
			existing,
		);

		expect(plan.applied).toEqual([]);
		expect(plan.protected).toEqual([
			{
				kind: "product-attribute",
				slug: "runner.care",
				reason: "existing translation differs (use --overwrite)",
			},
		]);
	});

	it("still writes a text attribute that has no translation at all", () => {
		const plan = planFixtureTranslations(
			fixture({ productAttributes: { runner: { material: "Bawełna" } } }),
			indexes,
			{ productAttributes: new Map() },
		);
		expect(plan.applied).toHaveLength(1);
		expect(plan.applied[0]).toMatchObject({
			id: "V-material",
			change: "new",
			input: { plainText: "Bawełna" },
		});
	});

	it("treats text that differs only in line breaks as unchanged", () => {
		const existing = {
			categories: new Map([["shoes", { name: "Buty", description: "Pierwszy akapit.\n\nDrugi akapit." }]]),
		};
		const plan = planFixtureTranslations(
			fixture({ categories: { shoes: { name: "Buty", description: "Pierwszy akapit. Drugi akapit." } } }),
			indexes,
			existing,
		);
		expect(plan).toMatchObject({ applied: [], protected: [], unchanged: 2 });
	});

	it("reports an empty fixture entry instead of crashing", () => {
		const plan = planFixtureTranslations(
			fixture({ categories: { shoes: null }, productAttributes: { runner: null } }),
			indexes,
			{},
		);
		expect(plan.applied).toEqual([]);
		expect(plan.skipped).toEqual([{ kind: "category", slug: "shoes", reason: "empty fixture entry" }]);
	});
});

describe("createGqlClient", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.unstubAllEnvs();
	});

	it("never has more requests in flight than SALEOR_MAX_CONCURRENT_REQUESTS", async () => {
		vi.stubEnv("SALEOR_MAX_CONCURRENT_REQUESTS", "2");
		vi.stubEnv("SALEOR_MIN_REQUEST_DELAY_MS", "0");

		let inFlight = 0;
		let peak = 0;
		vi.stubGlobal("fetch", async () => {
			inFlight++;
			peak = Math.max(peak, inFlight);
			await new Promise((resolve) => setTimeout(resolve, 5));
			inFlight--;
			return new Response(JSON.stringify({ data: { ok: true } }), { status: 200 });
		});

		const gql = createGqlClient("http://127.0.0.1:9/graphql/", "token");
		// Started in one tick, as the scripts do with Promise.all: all eight used to go out at once.
		const results = await Promise.all(Array.from({ length: 8 }, () => gql("query Probe { ok }")));

		expect(results).toHaveLength(8);
		expect(peak).toBe(2);
	});
});
