import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(import.meta.dirname, "../../../../eslint/paper-data-layer.mjs"), "utf8");

function allowlist(name: string): string[] {
	const match = source.match(new RegExp(`const ${name} = new Set\\(\\[([\\s\\S]*?)\\]\\);`));
	if (!match?.[1]) throw new Error(`missing ${name}`);
	return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]!);
}

/**
 * These lists may shrink. Adding a path is a new hole in the view-model boundary.
 */
describe("data-layer allowlists", () => {
	it("does not grow GQL_UI_ALLOW", () => {
		expect(allowlist("GQL_UI_ALLOW")).toEqual([
			"src/ui/components/account/address-card.tsx",
			"src/ui/components/account/address-form-dialog.tsx",
			"src/ui/components/account/order-row.tsx",
			"src/ui/components/account/order-row-labels.ts",
			"src/ui/components/account/order-status-badge.tsx",
			"src/ui/components/account/order-status-config.ts",
			"src/ui/components/account/order-timeline.tsx",
			"src/ui/components/nav/components/user-menu/components/user-avatar.tsx",
			"src/ui/components/nav/components/user-menu/components/user-info.tsx",
			"src/ui/components/nav/components/user-menu/user-menu.tsx",
			"src/ui/components/order-list-item.tsx",
			"src/ui/components/payment-status.tsx",
		]);
	});

	it("does not grow LIB_UI_ALLOW", () => {
		expect(allowlist("LIB_UI_ALLOW")).toEqual(["src/lib/cart-checkout.ts"]);
	});
});
