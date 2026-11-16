import { beforeEach, describe, expect, it, vi } from "vitest";
import { buyAgain } from "@/app/actions";

const mocks = vi.hoisted(() => ({
	variants: vi.fn(),
	mutate: vi.fn(),
	findOrCreate: vi.fn(),
	save: vi.fn(),
	refresh: vi.fn(),
	emit: vi.fn(),
}));
vi.mock("next/cache", () => ({ refresh: mocks.refresh }));
vi.mock("@/lib/auth/bff-server", () => ({ signOutSession: vi.fn() }));
vi.mock("@/lib/analytics/emit.server", () => ({ emitCommerceEvent: mocks.emit }));
vi.mock("@/lib/saleor", () => ({ mutate: mocks.mutate }));
vi.mock("@/lib/channel-slugs", () => ({ getStorefrontChannelSlugs: async () => ["default-channel"] }));
vi.mock("@/lib/checkout", () => ({
	findOrCreate: mocks.findOrCreate,
	getIdFromCookies: async () => "existing-cart",
	saveIdToCookie: mocks.save,
}));
vi.mock("@/lib/custom/get-buy-again", () => ({
	getRepeatVariants: mocks.variants,
	availableQuantity: (variant: { quantityAvailable: number }) => variant.quantityAvailable,
}));

const input = { channel: "default-channel", localeSlug: "en", lines: [{ variantId: "a", quantity: 2 }] };

describe("buyAgain server action", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.variants.mockResolvedValue([
			{ id: "a", quantityAvailable: 5, pricing: { price: { gross: { amount: 12, currency: "USD" } } } },
		]);
		mocks.findOrCreate.mockResolvedValue({
			id: "existing-cart",
			lines: [
				{ variant: { id: "a" }, quantity: 1 },
				{ variant: { id: "other" }, quantity: 3 },
			],
		});
		mocks.mutate.mockResolvedValue({
			ok: true,
			data: { checkoutLinesAdd: { checkout: { id: "existing-cart" }, errors: [] } },
		});
	});

	it("adds prior quantities to the existing checkout in a single mutation", async () => {
		expect(await buyAgain(input)).toEqual({ ok: true, added: 2, skipped: 0 });
		expect(mocks.mutate).toHaveBeenCalledExactlyOnceWith(expect.anything(), {
			variables: { id: "existing-cart", lines: [{ variantId: "a", quantity: 2 }] },
		});
		expect(mocks.refresh).toHaveBeenCalledTimes(1);
		expect(mocks.emit).toHaveBeenCalledExactlyOnceWith({
			name: "product_added_to_cart",
			channel: "default-channel",
			value: 24,
			currency: "USD",
		});
	});
	it("skips missing variants and trims quantity against existing cart stock", async () => {
		expect(
			await buyAgain({
				...input,
				lines: [
					{ variantId: "a", quantity: 6 },
					{ variantId: null, quantity: 1 },
					{ variantId: "deleted", quantity: 2 },
				],
			}),
		).toEqual({ ok: true, added: 4, skipped: 5 });
		expect(mocks.mutate.mock.calls[0][1].variables.lines).toEqual([{ variantId: "a", quantity: 4 }]);
	});
	it("does not create a checkout when nothing is available", async () => {
		mocks.variants.mockResolvedValue([]);
		expect(await buyAgain(input)).toEqual({ ok: false, error: "unavailable" });
		expect(mocks.findOrCreate).not.toHaveBeenCalled();
		expect(mocks.mutate).not.toHaveBeenCalled();
	});
	it("does not mutate a cart already at its stock limit", async () => {
		mocks.findOrCreate.mockResolvedValue({
			id: "existing-cart",
			lines: [{ variant: { id: "a" }, quantity: 5 }],
		});
		expect(await buyAgain(input)).toEqual({ ok: false, error: "unavailable" });
		expect(mocks.mutate).not.toHaveBeenCalled();
	});
	it("returns an inventory-race error rather than claiming success", async () => {
		mocks.mutate.mockResolvedValue({
			ok: true,
			data: { checkoutLinesAdd: { checkout: null, errors: [{ code: "INSUFFICIENT_STOCK" }] } },
		});
		expect(await buyAgain(input)).toEqual({ ok: false, error: "changed" });
		expect(mocks.emit).not.toHaveBeenCalled();
	});
	it("keeps an ambiguously updated cart accessible and does not retry the mutation", async () => {
		mocks.mutate.mockResolvedValue({ ok: false, error: { message: "Network timeout" } });
		expect(await buyAgain(input)).toEqual({ ok: false, error: "uncertain" });
		expect(mocks.save).toHaveBeenCalledExactlyOnceWith("default-channel", "existing-cart");
		expect(mocks.mutate).toHaveBeenCalledTimes(1);
		expect(mocks.emit).not.toHaveBeenCalled();
	});
	it.each([0, -1, 1.5, 1000, Number.NaN])(
		"rejects invalid quantity %s without API calls",
		async (quantity) => {
			expect(await buyAgain({ ...input, lines: [{ variantId: "a", quantity }] })).toEqual({
				ok: false,
				error: "invalid",
			});
			expect(mocks.variants).not.toHaveBeenCalled();
			expect(mocks.mutate).not.toHaveBeenCalled();
		},
	);
	it("rejects an unexposed channel", async () => {
		expect(await buyAgain({ ...input, channel: "private" })).toEqual({ ok: false, error: "invalid" });
		expect(mocks.variants).not.toHaveBeenCalled();
	});
});
