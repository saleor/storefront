#!/usr/bin/env node
/**
 * Wire agent skills for Cursor discovery.
 *
 * External skills: restored from skills-lock.json by the skills CLI. The CLI is an exact
 *   devDependency and the lock names a full commit and a content hash for every skill, so
 *   each clone gets the same files. --frozen-lockfile turns a mismatch into an error
 *   instead of a rewritten lock; `pnpm skills:update` is the one command that moves the pins.
 *   The CLI also links the skills into the folder of each agent it finds on this machine
 *   (.claude/skills/ for Claude Code, which does not read .agents/skills/).
 *
 * Project skill: skills/saleor-paper-storefront/ is the SoT. Cursor does not
 * scan repo-root skills/, so we symlink into .agents/skills/ (no copy, no drift).
 *
 * Usage: pnpm skills:bootstrap
 */
import { execSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const AGENTS_SKILLS_DIR = resolve(ROOT, ".agents/skills");
const PAPER_SKILL_LINK = resolve(AGENTS_SKILLS_DIR, "saleor-paper-storefront");

function ensurePaperSkillSymlink() {
	mkdirSync(AGENTS_SKILLS_DIR, { recursive: true });

	if (existsSync(PAPER_SKILL_LINK)) {
		const stat = lstatSync(PAPER_SKILL_LINK);
		if (stat.isSymbolicLink()) {
			console.log("[skills:bootstrap] Project skill symlink already present");
			return;
		}
		rmSync(PAPER_SKILL_LINK, { recursive: true, force: true });
		console.log("[skills:bootstrap] Removed stale .agents/skills/saleor-paper-storefront copy");
	}

	symlinkSync("../../skills/saleor-paper-storefront", PAPER_SKILL_LINK, "dir");
	console.log(
		"[skills:bootstrap] Linked .agents/skills/saleor-paper-storefront → skills/saleor-paper-storefront",
	);
}

ensurePaperSkillSymlink();

console.log("[skills:bootstrap] skills experimental_install --frozen-lockfile");
execSync("pnpm exec skills experimental_install --frozen-lockfile", { cwd: ROOT, stdio: "inherit" });

console.log("[skills:bootstrap] Done.");
