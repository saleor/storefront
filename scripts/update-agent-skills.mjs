#!/usr/bin/env node
/**
 * Re-pin the external agent skills to their sources' current commits.
 *
 * skills-lock.json pins each skill to a full commit and a content hash, so agents keep
 * getting the same instructions until someone runs this. For every GitHub source in the lock
 * it reads the commit the default branch is on, reinstalls that source's skills at that
 * commit, and lets the skills CLI record the new commit and hashes.
 *
 * Usage: pnpm skills:update                        every source
 *        pnpm skills:update saleor/agent-skills    only the named sources
 *
 * These files are instructions agents follow. Read what changed upstream (the compare links
 * this prints) before committing skills-lock.json.
 */
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { describePinMoves, readSkillsLock } from "./lib/skills-lock.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const only = process.argv.slice(2);

const before = readSkillsLock(ROOT);
if (!before) {
	console.error("[skills:update] skills-lock.json is missing. Run: git restore skills-lock.json");
	process.exit(1);
}

/** GitHub source → the names of its skills in the lock. */
const sources = new Map();
for (const [name, entry] of Object.entries(before.skills ?? {})) {
	if (entry.sourceType !== "github") {
		console.log(`[skills:update] Leaving ${name} as it is (${entry.sourceType} source, not GitHub)`);
		continue;
	}
	sources.set(entry.source, [...(sources.get(entry.source) ?? []), name]);
}

const unknown = only.filter((source) => !sources.has(source));
if (unknown.length > 0) {
	console.error(
		`[skills:update] Not a GitHub source in skills-lock.json: ${unknown.join(", ")}. Sources: ${[...sources.keys()].join(", ")}`,
	);
	process.exit(1);
}

const updated = [...sources].filter(([source]) => only.length === 0 || only.includes(source));
let failed;
for (const [source, names] of updated) {
	try {
		const [commit] = execFileSync("git", ["ls-remote", `https://github.com/${source}`, "HEAD"], {
			encoding: "utf8",
		}).split("\t");
		if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error("git ls-remote returned no commit for HEAD");
		console.log(`[skills:update] ${source} → ${commit}`);
		execFileSync("pnpm", ["exec", "skills", "add", `${source}@${commit}`, "--skill", ...names, "--yes"], {
			cwd: ROOT,
			stdio: "inherit",
		});
	} catch (error) {
		// Earlier sources are already re-pinned in the lock, so report them before failing.
		failed = `${source}: ${error.message.split("\n")[0]}`;
		break;
	}
}

const moves = describePinMoves(before, readSkillsLock(ROOT));
console.log(`\n[skills:update] ${moves.length > 0 ? "Pins that moved:" : "No pin moved."}`);
for (const line of moves) console.log(line);
if (moves.length > 0) {
	console.log("\n[skills:update] Read what changed upstream, then commit skills-lock.json.");
}
if (failed) {
	console.error(`\n[skills:update] Stopped at ${failed}`);
	process.exit(1);
}
