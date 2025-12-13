import { NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";
import { DefaultChannelSlug } from "@/app/config";

// GraphQL mutation for password reset request
const RequestPasswordResetDocument = /* GraphQL */ `
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

interface ForgotPasswordRequest {
	email: string;
}

interface RequestPasswordResetResponse {
	requestPasswordReset: {
		errors: Array<{
			field: string | null;
			message: string | null;
			code: string;
		}>;
	} | null;
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as ForgotPasswordRequest;
		const { email } = body;

		// Validate required fields
		if (!email) {
			return NextResponse.json({ message: "Email is required" }, { status: 400 });
		}

		const redirectUrl = `${process.env.NEXT_PUBLIC_STOREFRONT_URL || ""}/reset-password`;

		// Call Saleor API to request password reset
		const result = await executeGraphQL<
			RequestPasswordResetResponse,
			{ email: string; channel: string; redirectUrl: string }
		>(RequestPasswordResetDocument as unknown as Parameters<typeof executeGraphQL>[0], {
			variables: {
				email,
				channel: DefaultChannelSlug,
				redirectUrl,
			},
			cache: "no-store",
		});

		// Check for errors
		if (result.requestPasswordReset?.errors && result.requestPasswordReset.errors.length > 0) {
			// Don't reveal if email exists or not for security
			// Just return success message regardless
			console.error("Password reset errors:", result.requestPasswordReset.errors);
		}

		// Always return success to prevent email enumeration
		return NextResponse.json(
			{ message: "If an account with that email exists, we've sent a password reset link." },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Forgot password error:", error);
		// Still return success to prevent email enumeration
		return NextResponse.json(
			{ message: "If an account with that email exists, we've sent a password reset link." },
			{ status: 200 },
		);
	}
}
