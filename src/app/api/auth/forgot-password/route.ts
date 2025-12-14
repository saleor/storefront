import { NextResponse } from "next/server";
import { DefaultChannelSlug } from "@/app/config";
import { invariant } from "ts-invariant";

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
		const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
		invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL");

		// Call Saleor API directly
		const response = await fetch(saleorApiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				query: `
					mutation RequestPasswordReset($email: String!, $channel: String!, $redirectUrl: String!) {
						requestPasswordReset(email: $email, channel: $channel, redirectUrl: $redirectUrl) {
							errors {
								field
								message
								code
							}
						}
					}
				`,
				variables: {
					email,
					channel: DefaultChannelSlug,
					redirectUrl,
				},
			}),
		});

		const result = (await response.json()) as { data: RequestPasswordResetResponse };

		// Check for errors
		if (result.data?.requestPasswordReset?.errors && result.data.requestPasswordReset.errors.length > 0) {
			// Don't reveal if email exists or not for security
			// Just return success message regardless
			console.error("Password reset errors:", result.data.requestPasswordReset.errors);
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
