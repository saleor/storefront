import { beforeEach, describe, expect, it, vi } from "vitest";
import { buyAgain } from "./actions";
import { getBuyAgainAvailability, getBuyAgainCart } from "@/lib/custom/get-buy-again";
import { mutate } from "@/lib/saleor";
import * as Checkout from "@/lib/checkout";

vi.mock("next/cache", () => ({ refresh: vi.fn() }));
vi.mock("@/lib/saleor", () => ({ mutate: vi.fn() }));
vi.mock("@/lib/custom/get-buy-again", () => ({
	getBuyAgainAvailability: vi.fn(),
	getBuyAgainCart: vi.fn(),
}));
vi.mock("@/lib/checkout", () => ({
	getIdFromCookies: vi.fn(),
	findOrCreate: vi.fn(),
	saveIdToCookie: vi.fn(),
}));

const input = { channel: "default-channel", locale: "en", lines: [{ variantId: "available", quantity: 2 }] };
const stock = {
	ok: true,
	data: {
		productVariants: {
			edges: [
				{
					node: {
						id: "available",
						quantityAvailable: 5,
						product: { isAvailable: true },
						pricing: { price: { gross: { amount: 12, currency: "USD" } } },
					},
				},
				{
					node: {
						id: "sold-out",
						quantityAvailable: 0,
						product: { isAvailable: true },
						pricing: { price: { gross: { amount: 4, currency: "USD" } } },
					},
				},
			],
		},
	},
};

beforeEach(() => {
	vi.resetAllMocks();
	vi.mocked(getBuyAgainAvailability).mockResolvedValue(
		stock as Awaited<ReturnType<typeof getBuyAgainAvailability>>,
	);
	vi.mocked(Checkout.getIdFromCookies).mockResolvedValue("");
	vi.mocked(Checkout.findOrCreate).mockResolvedValue({ id: "cart" } as NonNullable<
		Awaited<ReturnType<typeof Checkout.findOrCreate>>
	>);
	vi.mocked(mutate).mockResolvedValue({
		ok: true,
		data: { checkoutLinesAdd: { checkout: { id: "cart" }, errors: [] } },
	});
});

describe("buyAgain", () => {
	it("adds available original quantities in one mutation, skipping sold-out lines", async () => {
		const result = await buyAgain({
			...input,
			lines: [...input.lines, { variantId: "sold-out", quantity: 1 }],
		});
		expect(result).toEqual({ ok: true, added: 2, skipped: 1 });
		expect(mutate).toHaveBeenCalledTimes(1);
		expect(mutate).toHaveBeenCalledWith(expect.anything(), { variables: { id: "cart", lines: input.lines } });
	});
	it("does not mutate or create a cart when nothing is available", async () => {
		const result = await buyAgain({ ...input, lines: [{ variantId: "removed", quantity: 1 }] });
		expect(result.ok).toBe(false);
		expect(mutate).not.toHaveBeenCalled();
		expect(Checkout.findOrCreate).not.toHaveBeenCalled();
	});
	it("rejects untrusted quantities before reading or writing", async () => {
		const result = await buyAgain({ ...input, lines: [{ variantId: "available", quantity: -1 }] });
		expect(result).toEqual({ ok: false, message: "Choose between 1 and 50 items to add." });
		expect(getBuyAgainAvailability).not.toHaveBeenCalled();
		expect(mutate).not.toHaveBeenCalled();
	});
	it("preserves a cart when its lookup fails rather than replacing it", async () => {
		vi.mocked(Checkout.getIdFromCookies).mockResolvedValue("existing");
		vi.mocked(getBuyAgainCart).mockResolvedValue({ ok: false } as Awaited<
			ReturnType<typeof getBuyAgainCart>
		>);
		const result = await buyAgain(input);
		expect(result).toEqual({
			ok: false,
			message: "Your cart could not be checked. Please try again; your existing items have not been changed.",
		});
		expect(mutate).not.toHaveBeenCalled();
		expect(Checkout.findOrCreate).not.toHaveBeenCalled();
		expect(Checkout.saveIdToCookie).not.toHaveBeenCalled();
	});
	it("rejects an existing checkout in a different channel", async () => {
		vi.mocked(Checkout.getIdFromCookies).mockResolvedValue("existing");
		vi.mocked(getBuyAgainCart).mockResolvedValue({
			ok: true,
			data: { checkout: { id: "existing", channel: { slug: "other" }, lines: [] } },
		} as unknown as Awaited<ReturnType<typeof getBuyAgainCart>>);
		const result = await buyAgain(input);
		expect(result).toEqual({
			ok: false,
			message: "Your cart belongs to another market. Open that market to continue.",
		});
		expect(mutate).not.toHaveBeenCalled();
	});
	it("does not report success when Saleor rejects a stale-stock batch", async () => {
		vi.mocked(mutate).mockResolvedValue({
			ok: true,
			data: { checkoutLinesAdd: { checkout: null, errors: [{ code: "INSUFFICIENT_STOCK" }] } },
		});
		expect(await buyAgain(input)).toEqual({
			ok: false,
			message: "Availability changed. Refresh this page and try again; nothing was added.",
		});
	});
});
