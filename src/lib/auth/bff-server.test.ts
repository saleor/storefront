import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { AccountErrorCode } from "@/gql/graphql";
import { resetPasswordWithToken, signInWithPassword } from "./bff-server";

const signIn = vi.fn();
const resetPassword = vi.fn();
const signOut = vi.fn();

vi.mock("./server", () => ({
	getServerAuthClient: vi.fn(async () => ({
		signIn,
		resetPassword,
		signOut,
	})),
}));

describe("signInWithPassword", () => {
	beforeEach(() => {
		signIn.mockReset();
	});

	it("returns ok when Saleor issues a token", async () => {
		signIn.mockResolvedValue({
			data: { tokenCreate: { token: "jwt", refreshToken: "refresh", errors: [] } },
		});

		await expect(signInWithPassword("user@example.com", "secret")).resolves.toEqual({ ok: true });
	});

	it("maps Saleor credential errors", async () => {
		signIn.mockResolvedValue({
			data: {
				tokenCreate: {
					errors: [{ message: "Invalid credentials", code: AccountErrorCode.InvalidCredentials }],
				},
			},
		});

		await expect(signInWithPassword("user@example.com", "bad")).resolves.toEqual({
			ok: false,
			errors: [{ message: "Invalid credentials", code: AccountErrorCode.InvalidCredentials }],
		});
	});
});

describe("resetPasswordWithToken", () => {
	beforeEach(() => {
		resetPassword.mockReset();
	});

	it("returns ok when password reset establishes a session", async () => {
		resetPassword.mockResolvedValue({
			data: { setPassword: { token: "jwt", refreshToken: "refresh", errors: [] } },
		});

		await expect(resetPasswordWithToken("user@example.com", "token", "new-pass")).resolves.toEqual({
			ok: true,
		});
	});
});
