#!/usr/bin/env node
/**
 * paper doctor — verify the agent setup is actually healthy.
 *
 * Problem this kills: a half-run `pnpm skills:bootstrap`, a broken symlink,
 * or a missing external skill leaves agents *silently* dumber (Cursor can't
 * discover the project skill; an external skill like vercel-react-best-practices
 * is gone). Nothing errors — sessions just get worse and nobody knows why.
 *
 * Run: pnpm doctor   (also a good CI gate: --check exits non-zero on any issue)
 *
 * Checks:
 *  1. Project skill symlinked into .agents/skills/ (Cursor scans there, not repo-root skills/)
 *  2. Every external skill pinned in skills-lock.json is installed under .agents/skills/
 *  3. Agent docs are not drifted (frontmatter present + compiled AGENTS.md in sync)
 *  4. The quarantined compiled doc is ignored from agents (.cursorignore)
 *  5. Always-on AGENTS.md carries the managed Next.js agent-rules block
 *  6. Required env present (NEXT_PUBLIC_SALEOR_API_URL) — only when --env
 *
 * Exit code 0 = healthy, 1 = something needs fixing. Every failure prints the fix.
 */
import { execSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const checkOnly = process.argv.includes("--check");
const checkEnv = process.argv.includes("--env");

const checksEnv = checkEnv ? readEnv() : {};

let problems = 0;

function fail(msg, fix) {
	problems++;
	console.error(`  ✗ ${msg}\n      fix: ${fix}`);
}
function ok(msg) {
	console.log(`  ✓ ${msg}`);
}

console.log("paper doctor — agent setup health check\n");

// 1. Project skill symlink ---------------------------------------------------
const paperLink = resolve(ROOT, ".agents/skills/saleor-paper-storefront");
const paperSrc = resolve(ROOT, "skills/saleor-paper-storefront");
if (!existsSync(paperSrc)) {
	fail(
		"skills/saleor-paper-storefront/ is missing — the project skill is gone.",
		"git restore skills/saleor-paper-storefront",
	);
} else if (!existsSync(paperLink) || !lstatSync(paperLink).isSymbolicLink()) {
	fail(
		"Project skill is not symlinked into .agents/skills/ — Cursor can't discover it.",
		"pnpm skills:bootstrap  (links skills/saleor-paper-storefront → .agents/skills/)",
	);
} else {
	ok("Project skill symlinked into .agents/skills/");
}

// 2. External skills installed ----------------------------------------------
const lockPath = resolve(ROOT, "skills-lock.json");
if (!existsSync(lockPath)) {
	fail("skills-lock.json is missing — external skills can't be restored.", "git restore skills-lock.json");
} else {
	const lock = JSON.parse(readFileSync(lockPath, "utf8"));
	const agentsDir = resolve(ROOT, ".agents/skills");
	const pinned = Object.keys(lock.skills ?? {});
	const missing = pinned.filter((name) => !existsSync(resolve(agentsDir, name)));
	if (pinned.length === 0) {
		fail("skills-lock.json pins no external skills.", "npx skills add <org/repo> --skill <name>");
	} else if (missing.length > 0) {
		fail(
			`External skills not installed: ${missing.join(", ")}`,
			"pnpm skills:bootstrap  (runs npx skills experimental_install from the lockfile)",
		);
	} else {
		ok(`All ${pinned.length} external skill(s) installed: ${pinned.join(", ")}`);
	}
}

// 3. Agent docs not drifted --------------------------------------------------
try {
	execSync("node skills/saleor-paper-storefront/scripts/ensure-rule-frontmatter.mjs --check", {
		cwd: ROOT,
		stdio: "pipe",
	});
	execSync("node skills/saleor-paper-storefront/scripts/compile-agents.mjs --check", {
		cwd: ROOT,
		stdio: "pipe",
	});
	ok("Agent docs in sync (rule frontmatter present, compiled AGENTS.md up to date)");
} catch {
	fail(
		"Agent docs are drifted (a rule lost frontmatter, or compiled AGENTS.md is stale vs rules/).",
		"pnpm run docs:compile",
	);
}

// 4. Compiled doc quarantined from agents -----------------------------------
const cursorignorePath = resolve(ROOT, ".cursorignore");
const cursorignore = existsSync(cursorignorePath) ? readFileSync(cursorignorePath, "utf8") : "";
const compiledRel = "skills/saleor-paper-storefront/AGENTS.md";
if (!cursorignore.includes(compiledRel)) {
	fail(
		`Compiled AGENTS.md (~75k tokens) is not in .cursorignore — an agent could auto-load it.`,
		`add "${compiledRel}" (and the .agents/skills/ path) to .cursorignore`,
	);
} else {
	ok("Compiled AGENTS.md quarantined from agents via .cursorignore");
}

// 5. Managed Next.js agent-rules block in always-on AGENTS.md ----------------
const agentsMdPath = resolve(ROOT, "AGENTS.md");
const agentsMd = existsSync(agentsMdPath) ? readFileSync(agentsMdPath, "utf8") : "";
if (!agentsMd.includes("BEGIN:nextjs-agent-rules")) {
	fail(
		"Always-on AGENTS.md is missing the managed <!-- BEGIN:nextjs-agent-rules --> block.",
		"start `next dev` once to regenerate it, then commit; do not hand-edit",
	);
} else {
	ok("Always-on AGENTS.md carries the managed Next.js agent-rules block");
}

// 6. Required env (opt-in) ---------------------------------------------------
if (checkEnv) {
	const saleorUrl = checksEnv.NEXT_PUBLIC_SALEOR_API_URL;
	if (!saleorUrl) {
		fail("NEXT_PUBLIC_SALEOR_API_URL is not set.", "add it to .env.local");
	} else {
		ok(`NEXT_PUBLIC_SALEOR_API_URL is set (${saleorUrl})`);
	}
}

// Summary -------------------------------------------------------------------
console.log("");
if (problems === 0) {
	console.log("✅ paper doctor: all checks passed — agent setup is healthy.");
	process.exit(0);
}
console.error(`❌ paper doctor: ${problems} problem(s) found. Fix the above, then re-run.`);
if (checkOnly) process.exit(1);

function readEnv() {
	const out = {};
	for (const file of [".env.local", ".env"]) {
		const p = resolve(ROOT, file);
		if (!existsSync(p)) continue;
		for (const line of readFileSync(p, "utf8").split("\n")) {
			const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
			if (m && !(m[1] in out)) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
		}
	}
	return out;
}
