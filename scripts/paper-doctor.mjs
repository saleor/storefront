#!/usr/bin/env node
/**
 * paper doctor — verify the agent setup is actually healthy.
 *
 * Problem this kills: a half-run `pnpm skills:bootstrap`, a broken symlink,
 * or a missing external skill leaves agents *silently* dumber (Cursor can't
 * discover the project skill; an external skill like vercel-react-best-practices
 * is gone). Nothing errors — sessions just get worse and nobody knows why.
 *
 * Run: pnpm doctor   (--check exits non-zero on any issue)
 *      --repo        only what the committed tree can answer. Skips checks 1 and 3, which
 *                    describe this machine's install. Build gates every PR on --check --repo;
 *                    .github/workflows/agent-skills.yml runs the full check after a real
 *                    restore, when the lock, the skills CLI or these scripts change.
 *
 * Checks:
 *  1. Project skill symlinked into .agents/skills/ (Cursor scans there, not repo-root skills/)
 *  2. skills-lock.json pins every external skill to a full commit and a content hash
 *  3. Every pinned skill is installed under .agents/skills/ and its files match the lock
 *     (skills installed there that the lock does not pin are listed, not failed)
 *  4. Agent docs are not drifted (frontmatter present + compiled AGENTS.md in sync)
 *  5. The quarantined compiled doc is ignored from agents (.cursorignore)
 *  6. Always-on AGENTS.md carries the managed Next.js agent-rules block
 *  7. Paper core hashes match paper-core.lock.json
 *  8. Required env present (NEXT_PUBLIC_SALEOR_API_URL) — only when --env
 *
 * Exit code 0 = healthy, 1 = something needs fixing. Every failure prints the fix.
 */
import { execSync } from "node:child_process";
import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { readSkillsLock, skillContentHash, unpinnedReasons } from "./lib/skills-lock.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const checkOnly = process.argv.includes("--check");
const checkEnv = process.argv.includes("--env");
const repoOnly = process.argv.includes("--repo");

const checksEnv = checkEnv ? readEnv() : {};

let problems = 0;

function fail(msg, fix) {
	problems++;
	console.error(`  ✗ ${msg}\n      fix: ${fix}`);
}
function ok(msg) {
	console.log(`  ✓ ${msg}`);
}
function note(msg) {
	console.log(`  • ${msg}`);
}

console.log(
	`paper doctor — agent setup health check${repoOnly ? " (repo only: this machine's install is not checked)" : ""}\n`,
);

// 1. Project skill symlink ---------------------------------------------------
const paperLink = resolve(ROOT, ".agents/skills/saleor-paper-storefront");
const paperSrc = resolve(ROOT, "skills/saleor-paper-storefront");
if (!existsSync(paperSrc)) {
	fail(
		"skills/saleor-paper-storefront/ is missing — the project skill is gone.",
		"git restore skills/saleor-paper-storefront",
	);
} else if (repoOnly) {
	ok("Project skill present in skills/saleor-paper-storefront/");
} else if (!existsSync(paperLink) || !lstatSync(paperLink).isSymbolicLink()) {
	fail(
		"Project skill is not symlinked into .agents/skills/ — Cursor can't discover it.",
		"pnpm skills:bootstrap  (links skills/saleor-paper-storefront → .agents/skills/)",
	);
} else {
	ok("Project skill symlinked into .agents/skills/");
}

// 2. External skills pinned --------------------------------------------------
const lock = readSkillsLock(ROOT);
const pinned = Object.keys(lock?.skills ?? {});
let lockIsPinned = false;
if (!lock) {
	fail("skills-lock.json is missing — external skills can't be restored.", "git restore skills-lock.json");
} else if (pinned.length === 0) {
	fail(
		"skills-lock.json pins no external skills.",
		"pnpm exec skills add <org/repo>@<full commit> --skill <name>",
	);
} else {
	const unpinned = unpinnedReasons(lock);
	lockIsPinned = unpinned.length === 0;
	if (lockIsPinned) {
		ok(`All ${pinned.length} external skill(s) pinned to a commit and a content hash`);
	} else {
		fail(
			`skills-lock.json leaves external skills free to change under agents:\n      - ${unpinned.join("\n      - ")}`,
			"pnpm skills:update  (re-pins each source to its current commit and records the hashes)",
		);
	}
}

// 3. External skills installed as pinned -------------------------------------
if (lockIsPinned && !repoOnly) {
	const agentsDir = resolve(ROOT, ".agents/skills");
	const missing = pinned.filter((name) => !existsSync(resolve(agentsDir, name)));
	const changed = pinned.filter(
		(name) =>
			!missing.includes(name) &&
			skillContentHash(resolve(agentsDir, name)) !== lock.skills[name].computedHash,
	);
	if (missing.length > 0 || changed.length > 0) {
		fail(
			[
				missing.length > 0 && `External skills not installed: ${missing.join(", ")}`,
				changed.length > 0 &&
					`External skills differ from skills-lock.json (stale or edited): ${changed.join(", ")}`,
			]
				.filter(Boolean)
				.join("\n    "),
			"pnpm skills:bootstrap  (restores exactly what skills-lock.json pins)",
		);
	} else {
		ok(`All ${pinned.length} external skill(s) installed and matching the lock: ${pinned.join(", ")}`);
	}
	// A restore never deletes, so a skill dropped from the lock stays installed. It cannot be
	// told apart from one this developer added on purpose, so it is named, not failed.
	const unlocked = !existsSync(agentsDir)
		? []
		: readdirSync(agentsDir).filter(
				(name) => !name.startsWith(".") && name !== "saleor-paper-storefront" && !pinned.includes(name),
			);
	if (unlocked.length > 0) {
		note(
			`Agents here also load skills that skills-lock.json does not pin: ${unlocked.join(", ")}\n      keep the ones you installed yourself; remove a leftover with: pnpm exec skills remove <name>`,
		);
	}
}

// 4. Agent docs not drifted --------------------------------------------------
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

// 5. Compiled doc quarantined from agents -----------------------------------
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

// 6. Managed Next.js agent-rules block in always-on AGENTS.md ----------------
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

// 7. Paper core hashes -------------------------------------------------------
try {
	execSync("node scripts/paper-core-lock.mjs --check", { cwd: ROOT, stdio: "pipe" });
	ok("Paper core hashes match paper-core.lock.json (or drift is declared)");
} catch (error) {
	const detail = error.stdout?.toString() || error.stderr?.toString() || "";
	fail(
		`Paper core drift.\n${detail.trim()}`,
		"pnpm core:lock on upstream, or declare the path in paper-version.json coreOverrides",
	);
}

// 8. Required env (opt-in) ---------------------------------------------------
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
