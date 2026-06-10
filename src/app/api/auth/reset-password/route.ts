import { NextRequest, NextResponse } from "next/server";
import { rejectIfRateLimited } from "@/lib/auth/auth-rate-limit";
import { isAllowedRedirectUrl } from "@/lib/auth/validate-redirect-url";
import { executeRawGraphQL, getUserMessage } from "@/lib/graphql";

const REQUEST_PASSWORD_RESET_MUTATION = `
  mutation RequestPasswordReset($email: String!, $channel: String!, $redirectUrl: String!) {
    requestPasswordReset(email: $email, channel: $channel, redirectUrl: $redirectUrl) {
      errors {
        field
        message
        code
      }
    }
  }
`;

interface ResetPasswordRequest {
	email: string;
	channel: string;
	redirectUrl: string;
}

interface RequestPasswordResetResult {
	requestPasswordReset?: {
		errors?: Array<{ field?: string | null; message: string; code?: string | null }>;
	};
}

export async function POST(request: NextRequest) {
	const rateLimited = rejectIfRateLimited(request, "reset-password", { limit: 5, windowMs: 60 * 60 * 1000 });
	if (rateLimited) {
		return rateLimited;
	}

	let body: ResetPasswordRequest;
	try {
		body = (await request.json()) as ResetPasswordRequest;
	} catch {
		return NextResponse.json(
			{ errors: [{ message: "Invalid request body", code: "INVALID_JSON" }] },
			{ status: 400 },
		);
	}

	const { email, channel, redirectUrl } = body;

	if (!email || !channel || !redirectUrl) {
		return NextResponse.json(
			{ errors: [{ message: "Email, channel, and redirectUrl are required", code: "REQUIRED" }] },
			{ status: 400 },
		);
	}

	// Reset emails embed this URL — only this deployment's surfaces are allowed.
	if (!isAllowedRedirectUrl(redirectUrl, request.nextUrl.origin)) {
		return NextResponse.json(
			{ errors: [{ message: "Invalid redirect URL", code: "INVALID" }] },
			{ status: 400 },
		);
	}

	const result = await executeRawGraphQL<RequestPasswordResetResult>({
		query: REQUEST_PASSWORD_RESET_MUTATION,
		variables: { email, channel, redirectUrl },
	});

	// Network or GraphQL error
	if (!result.ok) {
		console.error("Password reset error:", result.error.type);
		return NextResponse.json(
			{ errors: [{ message: getUserMessage(result.error), code: result.error.type.toUpperCase() }] },
			{ status: result.error.type === "network" ? 503 : 400 },
		);
	}

	const requestPasswordReset = result.data.requestPasswordReset;

	// Saleor validation errors - log but don't expose to prevent email enumeration
	if (requestPasswordReset?.errors?.length) {
		console.error("Password reset validation errors");
		// Still return success to prevent email enumeration
	}

	// Always return success to prevent email enumeration
	return NextResponse.json({ success: true });
}
