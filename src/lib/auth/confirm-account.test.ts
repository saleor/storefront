import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { confirmAccountWithToken } from "./confirm-account";

const executeRawGraphQL = vi.fn();

vi.mock("@/lib/graphql", () => ({
	executeRawGraphQL: (...args: unknown[]) => executeRawGraphQL(...args),
}));

describe("confirmAccountWithToken", () => {
	beforeEach(() => {
		executeRawGraphQL.mockReset();
	});

	it("returns ok when Saleor confirms the user", async () => {
		executeRawGraphQL.mockResolvedValue({
			ok: true,
			data: {
				confirmAccount: {
					user: { id: "1", email: "user@example.com", isConfirmed: true, isActive: true },
					errors: [],
				},
			},
		});

		await expect(confirmAccountWithToken("user@example.com", "token")).resolves.toEqual({ ok: true });
	});

	it("maps Saleor validation errors", async () => {
		executeRawGraphQL.mockResolvedValue({
			ok: true,
			data: {
				confirmAccount: {
					user: null,
					errors: [{ message: "Invalid token", code: "INVALID_TOKEN" }],
				},
			},
		});

		await expect(confirmAccountWithToken("user@example.com", "bad")).resolves.toEqual({
			ok: false,
			errors: [{ message: "Invalid token", code: "INVALID_TOKEN" }],
		});
	});
});
