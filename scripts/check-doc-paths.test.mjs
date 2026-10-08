import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { checkDocs, pathsInLine, removedSymbolsInLine } from "./check-doc-paths.mjs";

describe("pathsInLine", () => {
	it("reads backticked repo paths and strips line suffixes and punctuation", () => {
		expect(pathsInLine("See `src/lib/saleor/access.ts:62`, then `data-layer.lock.md`.")).toEqual([
			"src/lib/saleor/access.ts",
			"data-layer.lock.md",
		]);
	});

	it("expands one brace group", () => {
		expect(pathsInLine("`src/lib/{catalog,menus}`")).toEqual(["src/lib/catalog", "src/lib/menus"]);
	});

	it("skips placeholders, globs, and non-paths", () => {
		expect(pathsInLine("`src/templates/pdp/<name>.tsx` `src/graphql/*.graphql` `cachedQuery`")).toEqual([]);
	});
});

describe("removedSymbolsInLine", () => {
	it("flags a removed API unless the line marks it removed", () => {
		expect(removedSymbolsInLine("call executePublicGraphQL here")).toEqual(["executePublicGraphQL"]);
		expect(removedSymbolsInLine("removed: executePublicGraphQL → cachedQuery")).toEqual([]);
	});
});

describe("checkDocs", () => {
	it("reports a missing path and allows a path the line says to create", () => {
		const root = mkdtempSync(join(tmpdir(), "doc-paths-"));
		mkdirSync(join(root, "src/lib"), { recursive: true });
		writeFileSync(join(root, "src/lib/real.ts"), "");
		const doc = join(root, "AGENTS.md");
		writeFileSync(
			doc,
			["`src/lib/real.ts`", "`src/lib/gone.ts`", "Create `src/lib/new.ts`", "Create `src/nope/new.ts`"].join(
				"\n",
			),
		);

		const { problems } = checkDocs([doc], root);
		expect(problems).toEqual([
			"AGENTS.md:2  missing path `src/lib/gone.ts`",
			"AGENTS.md:4  missing path `src/nope/new.ts`",
		]);
	});
});
