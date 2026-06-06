import "server-only";

import { mapSaleorAuthErrors } from "./auth-api-utils";
import type { AuthApiError } from "./auth-api-types";
import { getServerAuthClient } from "./server";

export type { AuthApiError };

/** Sign in via Saleor and persist tokens in request cookies (BFF). */
export async function signInWithPassword(
	email: string,
	password: string,
): Promise<{ ok: true } | { ok: false; errors: AuthApiError[] }> {
	const authClient = await getServerAuthClient();
	const result = await authClient.signIn({ email, password });
	const tokenCreate = result.data?.tokenCreate;

	if (tokenCreate?.errors?.length) {
		return { ok: false, errors: mapSaleorAuthErrors(tokenCreate.errors, "Sign in failed") };
	}

	if (tokenCreate?.token) {
		return { ok: true };
	}

	return { ok: false, errors: [{ message: "Sign in failed" }] };
}

/** Complete password reset and establish a session (BFF). */
export async function resetPasswordWithToken(
	email: string,
	token: string,
	password: string,
): Promise<{ ok: true } | { ok: false; errors: AuthApiError[] }> {
	const authClient = await getServerAuthClient();
	const result = await authClient.resetPassword({ email, token, password });
	const setPassword = result.data?.setPassword;

	if (setPassword?.errors?.length) {
		return { ok: false, errors: mapSaleorAuthErrors(setPassword.errors, "Failed to reset password") };
	}

	if (setPassword?.token) {
		return { ok: true };
	}

	return { ok: false, errors: [{ message: "Failed to reset password" }] };
}

/** Clear Saleor auth cookies for the current session. */
export async function signOutSession(): Promise<void> {
	(await getServerAuthClient()).signOut();
}
