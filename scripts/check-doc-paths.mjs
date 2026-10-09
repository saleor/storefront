#!/usr/bin/env node
/**
 * Fail when agent-facing docs point at a path that does not exist or teach a removed API.
 *
 *   node scripts/check-doc-paths.mjs
 *
 * Scans root AGENTS.md, src/**\/AGENTS.md, and the Paper skill (SKILL.md, rules/, references/).
 * ADRs and migrations are history and are not scanned. The compiled skill AGENTS.md is
 * generated from rules/ and is not scanned either.
 *
 * A line that also contains `removed:` may name a removed API (migration notes).
 * On a line that says "Create", a path only needs its parent directory to exist.
 * A line that says "Do not add" or "Do not create" names a path that must not exist.
 * A path under a codegen output root passes until codegen has run (a clean checkout has none).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = join(import.meta.dirname, "..");
const SKILL = join(ROOT, "skills/saleor-paper-storefront");

const PATH_PREFIXES = ["src/", "scripts/", "e2e/", "docs/", "skills/", "eslint/", ".github/"];
const ROOT_FILES = new Set([
	"AGENTS.md",
	"data-layer.lock.md",
	"paper-core.lock.json",
	"paper-version.json",
	"next.config.js",
	"package.json",
	"skills-lock.json",
	"eslint.config.mjs",
	".graphqlrc.ts",
]);

/** Codegen output (gitignored). Checked like any path once codegen has created the root. */
export const GENERATED_ROOTS = ["src/gql/", "src/checkout/graphql/generated/"];

/**
 * Removed APIs, and kernel internals agents cannot import (`applyCacheProfile` is
 * `bindCacheProfile` on `@/lib/saleor`). Docs must not teach them.
 */
export const REMOVED_SYMBOLS = [
	"executePublicGraphQL",
	"executeAuthenticatedGraphQL",
	"fetch-filtered-listing",
	"isCacheableListingView",
	"assertSupportedSort",
	"getProductListingPage",
	"getCategoryListingPage",
	"getCollectionListingPage",
	"applyCacheProfile",
];

function markdownIn(dir) {
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((name) => name.endsWith(".md"))
		.map((name) => join(dir, name));
}

function agentsFilesUnder(dir, acc = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) agentsFilesUnder(path, acc);
		else if (entry.name === "AGENTS.md") acc.push(path);
	}
	return acc;
}

export function docFiles() {
	return [
		join(ROOT, "AGENTS.md"),
		...agentsFilesUnder(join(ROOT, "src")),
		join(SKILL, "SKILL.md"),
		...markdownIn(join(SKILL, "rules")),
		...markdownIn(join(SKILL, "references")),
	].filter((file) => existsSync(file));
}

/** `src/lib/{a,b}/x.ts` → both paths. One brace group is enough for the docs we write. */
function expandBraces(token) {
	const match = token.match(/^(.*?)\{([^{}]+)\}(.*)$/);
	if (!match) return [token];
	const [, head, body, tail] = match;
	return body.split(",").flatMap((part) => expandBraces(`${head}${part.trim()}${tail}`));
}

function looksLikePath(token) {
	if (ROOT_FILES.has(token)) return true;
	return PATH_PREFIXES.some((prefix) => token.startsWith(prefix));
}

/** Backticked repo paths on one line, normalized. */
export function pathsInLine(line) {
	const out = [];
	for (const match of line.matchAll(/`([^`\n]+)`/g)) {
		let token = match[1].trim();
		if (/[<>*$ ]|…|\.\.\./.test(token)) continue;
		token = token.replace(/:\d+(-\d+)?$/, "").replace(/[.,;:)]+$/, "");
		if (token.startsWith("./")) token = token.slice(2);
		if (!looksLikePath(token)) continue;
		out.push(...expandBraces(token));
	}
	return out;
}

/** True when `path` is codegen output and codegen has not run, so nothing can be checked yet. */
function isUngenerated(path, root) {
	const generatedRoot = GENERATED_ROOTS.find((dir) => `${path.replace(/\/$/, "")}/`.startsWith(dir));
	return generatedRoot !== undefined && !existsSync(join(root, generatedRoot));
}

export function removedSymbolsInLine(line) {
	if (line.includes("removed:")) return [];
	return REMOVED_SYMBOLS.filter((symbol) => line.includes(symbol));
}

export function checkDocs(files = docFiles(), root = ROOT) {
	const problems = [];
	let checked = 0;
	let skipped = 0;
	for (const file of files) {
		const rel = relative(root, file);
		const lines = readFileSync(file, "utf8").split("\n");
		lines.forEach((line, index) => {
			const forbidsPath = /\b(?:do not|don't|never) (?:add|create)\b/i.test(line);
			const createsPath = /\bcreate\b/i.test(line);
			for (const path of pathsInLine(line)) {
				if (forbidsPath || isUngenerated(path, root)) {
					skipped++;
					continue;
				}
				checked++;
				const target = join(root, path.replace(/\/$/, ""));
				if (existsSync(target)) continue;
				if (createsPath && existsSync(dirname(target))) continue;
				problems.push(`${rel}:${index + 1}  missing path \`${path}\``);
			}
			for (const symbol of removedSymbolsInLine(line)) {
				problems.push(`${rel}:${index + 1}  removed API \`${symbol}\``);
			}
		});
	}
	return { problems, checked, skipped, files: files.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const { problems, checked, skipped, files } = checkDocs();
	if (problems.length > 0) {
		console.error(problems.join("\n"));
		console.error(`\n${problems.length} stale doc reference(s). Fix the doc or the path.`);
		process.exit(1);
	}
	const skippedNote = skipped > 0 ? ` (${skipped} skipped: not generated yet or marked do-not-add)` : "";
	console.log(`Doc paths: ${checked} path(s) in ${files} file(s) exist${skippedNote}; no removed APIs.`);
}
