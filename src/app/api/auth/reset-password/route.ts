import { NextRequest, NextResponse } from "next/server";

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

interface RequestPasswordResetResponse {
	data?: {
		requestPasswordReset?: {
			errors?: Array<{ field?: string; message: string; code?: string }>;
		};
	};
	errors?: Array<{ message: string }>;
}

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as ResetPasswordRequest;
		const { email, channel, redirectUrl } = body;

		if (!email || !channel || !redirectUrl) {
			return NextResponse.json(
				{ errors: [{ message: "Email, channel, and redirectUrl are required", code: "REQUIRED" }] },
				{ status: 400 },
			);
		}

		const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
		if (!saleorApiUrl) {
			return NextResponse.json(
				{ errors: [{ message: "Server configuration error", code: "SERVER_ERROR" }] },
				{ status: 500 },
			);
		}

		const response = await fetch(saleorApiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: REQUEST_PASSWORD_RESET_MUTATION,
				variables: { email, channel, redirectUrl },
			}),
		});

		const data = (await response.json()) as RequestPasswordResetResponse;

		if (data.errors) {
			// Log only that an error occurred, not the full error (may contain PII)
			console.error("GraphQL error during password reset");
			return NextResponse.json(
				{ errors: data.errors.map((e) => ({ message: e.message, code: "GRAPHQL_ERROR" })) },
				{ status: 400 },
			);
		}

		const result = data.data?.requestPasswordReset;

		if (result?.errors?.length) {
			// Log only error codes, not messages (which may contain email addresses)
			console.error("Password reset failed:", result.errors.map((e) => e.code).join(", "));
			return NextResponse.json({ errors: result.errors }, { status: 400 });
		}

		// Success - always return success to prevent email enumeration
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Password reset error:", error);
		return NextResponse.json(
			{ errors: [{ message: "An unexpected error occurred", code: "SERVER_ERROR" }] },
			{ status: 500 },
		);
	}
}
