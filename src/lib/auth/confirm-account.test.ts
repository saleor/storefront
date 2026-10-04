import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { confirmAccountWithToken } from "./confirm-account";

const rawMutation = vi.fn();

vi.mock("@/lib/saleor", () => ({
	rawMutation: (...args: unknown[]) => rawMutation(...args),
}));

describe("confirmAccountWithToken", () => {
	beforeEach(() => {
		rawMutation.mockReset();
	});

	it("returns ok when Saleor confirms the user", async () => {
		rawMutation.mockResolvedValue({
			ok: true,
			data: {
				confirmAccount: {
					user: { id: "1", email: "user@example.com", isConfirmed: true, isActive: true },
					errors: [],
				},
			},
		});

		await expect(confirmAccountWithToken("user@example.com", "token", "secret")).resolves.toEqual({
			ok: true,
		});
		expect(rawMutation).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: { email: "user@example.com", token: "token", password: "secret" },
			}),
		);
	});

	it("maps Saleor validation errors", async () => {
		rawMutation.mockResolvedValue({
			ok: true,
			data: {
				confirmAccount: {
					user: null,
					errors: [{ message: "Invalid token", code: "INVALID_TOKEN" }],
				},
			},
		});

		await expect(confirmAccountWithToken("user@example.com", "bad", "secret")).resolves.toEqual({
			ok: false,
			errors: [{ message: "Invalid token", code: "INVALID_TOKEN" }],
		});
	});
});
