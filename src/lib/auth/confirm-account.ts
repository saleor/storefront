import "server-only";

import { mapSaleorAuthErrors } from "./auth-api-utils";
import type { AuthApiError } from "./auth-api-types";
import { executeRawGraphQL } from "@/lib/graphql";

const CONFIRM_ACCOUNT_MUTATION = `
  mutation ConfirmAccount($email: String!, $token: String!) {
    confirmAccount(email: $email, token: $token) {
      user {
        id
        email
        isConfirmed
        isActive
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

type ConfirmAccountResult = {
	confirmAccount?: {
		user?: { id: string; email: string; isConfirmed: boolean; isActive: boolean } | null;
		errors?: Array<{ field?: string | null; message?: string | null; code?: string | null }>;
	};
};

/** Activate a user account with the one-time token from the registration email. */
export async function confirmAccountWithToken(
	email: string,
	token: string,
): Promise<{ ok: true } | { ok: false; errors: AuthApiError[] }> {
	const result = await executeRawGraphQL<ConfirmAccountResult>({
		query: CONFIRM_ACCOUNT_MUTATION,
		variables: { email, token },
	});

	if (!result.ok) {
		return {
			ok: false,
			errors: [{ message: result.error.message, code: result.error.type.toUpperCase() }],
		};
	}

	const payload = result.data.confirmAccount;
	const errors = payload?.errors ?? [];

	if (errors.length > 0) {
		return { ok: false, errors: mapSaleorAuthErrors(errors, "Failed to confirm account") };
	}

	if (payload?.user?.isConfirmed) {
		return { ok: true };
	}

	return { ok: false, errors: [{ message: "Failed to confirm account" }] };
}
