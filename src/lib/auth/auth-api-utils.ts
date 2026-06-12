import { AccountErrorCode } from "@/gql/graphql";

import type { AuthApiError } from "./auth-api-types";

const INVALID_CREDENTIAL_CODES = new Set<string>([
	AccountErrorCode.InvalidCredentials,
	AccountErrorCode.InvalidPassword,
]);

const FORBIDDEN_AUTH_CODES = new Set<string>([
	AccountErrorCode.Inactive,
	AccountErrorCode.AccountNotConfirmed,
]);

const RATE_LIMIT_CODES = new Set<string>([AccountErrorCode.LoginAttemptDelayed, "RATE_LIMITED"]);

export function isInvalidCredentialsError(code?: string | null): boolean {
	if (!code) {
		return false;
	}

	return INVALID_CREDENTIAL_CODES.has(code);
}

/** Map Saleor auth error codes to HTTP status for BFF routes. */
export function httpStatusForAuthErrors(errors: AuthApiError[]): number {
	if (errors.some((error) => RATE_LIMIT_CODES.has(error.code ?? ""))) {
		return 429;
	}

	if (errors.some((error) => isInvalidCredentialsError(error.code))) {
		return 401;
	}

	if (errors.some((error) => FORBIDDEN_AUTH_CODES.has(error.code ?? ""))) {
		return 403;
	}

	return 400;
}

export function mapSaleorAuthErrors(
	errors: Array<{ message?: string | null; code?: string | null }> | undefined | null,
	fallback: string,
): AuthApiError[] {
	if (!errors?.length) {
		return [{ message: fallback }];
	}

	return errors.map((error) => ({
		message: error.message || fallback,
		code: error.code,
	}));
}
