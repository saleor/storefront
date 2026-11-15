/**
 * skills-lock.json records the external agent skills this repo ships. Each skill is pinned to
 * a full commit of its source and to a hash of the files that commit installs, so every clone
 * gets the same instructions. Shared by paper-doctor (checks) and update-agent-skills (re-pins).
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { join, sep } from "node:path";

/** The lock format whose `computedHash` covers the installed files (skills CLI 1.8+). */
const LOCK_VERSION = 2;
const GIT_SOURCE_TYPES = new Set(["github", "gitlab", "git"]);
const FULL_COMMIT = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;

/** @returns the parsed lock, or null when the repo has none. */
export function readSkillsLock(root) {
	const path = join(root, "skills-lock.json");
	return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;
}

/**
 * One line per reason the lock leaves a skill free to change under us. Empty when every skill
 * is pinned. A branch or tag is not a pin: it can move, and a restore then installs new files.
 */
export function unpinnedReasons(lock) {
	const reasons = [];
	if (lock.version !== LOCK_VERSION) {
		reasons.push(`the lock is version ${lock.version}; content hashes need version ${LOCK_VERSION}`);
	}
	for (const [name, entry] of Object.entries(lock.skills ?? {})) {
		if (GIT_SOURCE_TYPES.has(entry.sourceType) && !FULL_COMMIT.test(entry.ref ?? "")) {
			const follows = entry.ref ? `"${entry.ref}"` : "the default branch";
			reasons.push(`${name} follows ${follows} of ${entry.source} instead of a full commit`);
		}
		if (!SHA256.test(entry.computedHash ?? "")) reasons.push(`${name} has no content hash`);
	}
	return reasons;
}

/**
 * Lines describing every pin that differs between two versions of the lock. Skills are grouped
 * by source and commit range, so one source can hold skills on different commits and each
 * range's compare link appears once. Empty when nothing moved.
 */
export function describePinMoves(before, after) {
	// A version 1 hash covers different bytes, so it says nothing about whether the files changed.
	const comparable = before.version === after.version;
	const ranges = new Map();
	for (const [name, now] of Object.entries(after.skills ?? {})) {
		const was = before.skills?.[name];
		if (was?.ref === now.ref && was?.computedHash === now.computedHash) continue;
		const from = was ? (was.ref ?? "unpinned") : "new";
		const range = `${now.source}: ${from} → ${now.ref ?? "unpinned"}`;
		const link =
			was?.ref && now.ref && now.sourceType === "github"
				? [`    https://github.com/${now.source}/compare/${was.ref}...${now.ref}`]
				: [];
		const files = !was
			? "added"
			: !comparable
				? "pinned"
				: was.computedHash === now.computedHash
					? "files unchanged"
					: "files changed";
		ranges.set(range, [...(ranges.get(range) ?? [`  ${range}`, ...link]), `    ${name}: ${files}`]);
	}
	return [...ranges.values()].flat();
}

const EXCLUDED_FILES = new Set(["metadata.json"]);
const EXCLUDED_DIRS = new Set([".git", "__pycache__", "__pypackages__"]);

function isExcluded(name, isDirectory) {
	return EXCLUDED_FILES.has(name) || (isDirectory && EXCLUDED_DIRS.has(name));
}

/** Text files hash as LF, so a checkout with CRLF line endings matches. Binary files are left alone. */
function normalizeLineEndings(content) {
	if (content.includes(0) || !content.includes("\r\n")) return content;
	return Buffer.from(content.toString("latin1").replaceAll("\r\n", "\n"), "latin1");
}

function collectFiles(dir, prefix, root, ancestors, files) {
	const realDir = realpathSync(dir);
	if (ancestors.has(realDir)) return; // a symlink loop
	const branch = new Set(ancestors).add(realDir);
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		let isDirectory = entry.isDirectory();
		if (isExcluded(entry.name, isDirectory)) continue;
		const fullPath = join(dir, entry.name);
		if (entry.isSymbolicLink()) {
			let target;
			try {
				target = realpathSync(fullPath);
			} catch {
				continue; // broken link
			}
			if (target !== root && !target.startsWith(root + sep)) continue; // points outside the skill
			isDirectory = statSync(target).isDirectory();
			if (isExcluded(entry.name, isDirectory)) continue;
		} else if (!isDirectory && !entry.isFile()) {
			continue;
		}
		if (isDirectory) collectFiles(fullPath, `${prefix}${entry.name}/`, root, branch, files);
		else files.push({ path: Buffer.from(prefix + entry.name, "utf8"), content: readFileSync(fullPath) });
	}
}

/**
 * The lock's `computedHash` for an installed skill folder. This follows the algorithm the
 * skills CLI publishes for other tools ("Lock File Content Hash" in its README), so doctor can
 * tell a stale or edited install without the network. The test file holds the CLI's vectors.
 */
export function skillContentHash(skillDir) {
	const files = [];
	collectFiles(skillDir, "", realpathSync(skillDir), new Set(), files);
	files.sort((a, b) => Buffer.compare(a.path, b.path));
	const hash = createHash("sha256");
	for (const file of files) {
		const content = normalizeLineEndings(file.content);
		hash.update(file.path).update("\0").update(String(content.length)).update("\0").update(content);
	}
	return hash.digest("hex");
}
