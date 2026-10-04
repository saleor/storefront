import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { paperCacheLifeProfiles } from "../cache/life-profiles";
import { CACHE_PROFILE_LIST } from "../cache/manifest";
import { getOperation, listCoreOperations } from "../operations";

const ROOT = join(import.meta.dirname, "../../../..");

function operationNames(dir: string): string[] {
	const names: string[] = [];
	for (const file of readdirSync(dir, { recursive: true })) {
		if (typeof file !== "string" || !file.endsWith(".graphql")) continue;
		const text = readFileSync(join(dir, file), "utf8");
		for (const match of text.matchAll(/^(?:query|mutation|subscription)\s+(\w+)/gm)) {
			names.push(match[1]!);
		}
	}
	return names;
}

describe("cache life floors", () => {
	it("keeps catalog and menu backstops at an hour or more", () => {
		expect(paperCacheLifeProfiles.catalog.revalidate).toBeGreaterThanOrEqual(3600);
		expect(paperCacheLifeProfiles.menus.revalidate).toBeGreaterThanOrEqual(3600);
		expect(paperCacheLifeProfiles.channels.revalidate).toBeGreaterThanOrEqual(86400);
		for (const tier of Object.values(paperCacheLifeProfiles)) {
			expect(tier.expire).toBeGreaterThan(tier.revalidate);
			expect(tier.stale).toBeGreaterThan(0);
		}
	});
});

describe("operation registry", () => {
	const storefront = operationNames(join(ROOT, "src/graphql"));
	const checkout = operationNames(join(ROOT, "src/checkout/graphql"));
	const declared = new Set([...storefront, ...checkout]);

	it("registers every operation and no stale names", () => {
		const missing = [...declared].filter((name) => !getOperation(name));
		const stale = Object.keys(listCoreOperations()).filter((name) => !declared.has(name));
		expect(missing, `add to operations.ts or data-extensions.ts: ${missing.join(", ")}`).toEqual([]);
		expect(stale, `remove from operations.ts: ${stale.join(", ")}`).toEqual([]);
	});

	it("never caches a mutation", () => {
		for (const dir of ["src/graphql", "src/checkout/graphql"]) {
			for (const file of readdirSync(join(ROOT, dir), { recursive: true })) {
				if (typeof file !== "string" || !file.endsWith(".graphql")) continue;
				const text = readFileSync(join(ROOT, dir, file), "utf8");
				for (const match of text.matchAll(/^mutation\s+(\w+)/gm)) {
					const spec = getOperation(match[1]!);
					expect(spec?.access, match[1]).toBe("mutate");
				}
			}
		}
	});

	it("requires channel and language variables on channel-locale cached operations", () => {
		const files = new Map<string, string>();
		for (const dir of ["src/graphql", "src/checkout/graphql"]) {
			for (const file of readdirSync(join(ROOT, dir), { recursive: true })) {
				if (typeof file !== "string" || !file.endsWith(".graphql")) continue;
				files.set(file, readFileSync(join(ROOT, dir, file), "utf8"));
			}
		}
		const all = [...files.values()].join("\n");
		for (const [name, spec] of Object.entries(listCoreOperations())) {
			if (spec.access !== "cached") continue;
			const match = all.match(new RegExp(`(?:query|mutation)\\s+${name}\\b\\s*(?:\\(([^)]*)\\))?`, "s"));
			expect(match, `${name} declaration`).toBeTruthy();
			const vars = match?.[1] ?? "";
			if (spec.scope === "channel-locale") {
				expect(vars, name).toContain("$channel");
				expect(vars, name).toMatch(/\$languageCode/);
			}
			if (spec.scope === "locale") {
				expect(vars, name).toMatch(/\$languageCode/);
			}
			expect(spec.scope, `${name} needs an explicit scope`).toBeTruthy();
		}
	});
});

describe("manifest tag contract", () => {
	it("pins tag patterns so a silent rename fails the paper-app handshake", () => {
		const patterns = CACHE_PROFILE_LIST.map((profile) => `${profile.id}:${profile.tagPattern}`).sort();
		const fingerprint = createHash("sha256").update(patterns.join("|")).digest("hex").slice(0, 16);
		expect(patterns).toEqual([
			"categories:category:{slug}",
			"channels:channels",
			"collections:collection:{slug}",
			"footer-menu:footer-menu:{channel}",
			"listing-all:listing:all:{channel}",
			"listing-category:listing:category:{channel}:{slug}",
			"listing-collection:listing:collection:{channel}:{slug}",
			"navigation:navigation:{channel}",
			"pages:page:{slug}",
			"products:product:{slug}",
			"storefront-content:storefront-content:{channel}:{locale}",
		]);
		expect(fingerprint).toHaveLength(16);
	});
});
