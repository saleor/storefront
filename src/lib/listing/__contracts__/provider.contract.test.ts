import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LISTING_PROVIDER_REGISTRY } from "@/config/listing-providers";

const ROOT = join(import.meta.dirname, "../../../..");

describe("listing provider contract coverage", () => {
	it("gives every registered provider a contract test", () => {
		for (const id of Object.keys(LISTING_PROVIDER_REGISTRY)) {
			const file = join(ROOT, "src/lib/listing/providers", id, "contract.test.ts");
			expect(
				existsSync(file),
				`add src/lib/listing/providers/${id}/contract.test.ts (pnpm paper:new provider listing ${id})`,
			).toBe(true);
			expect(readFileSync(file, "utf8"), `${id} contract test`).toContain("runListingProviderContract");
		}
	});

	it("registers each provider under its own id", () => {
		for (const [id, provider] of Object.entries(LISTING_PROVIDER_REGISTRY)) {
			expect(provider.id, `LISTING_PROVIDER_REGISTRY.${id}`).toBe(id);
		}
	});
});
