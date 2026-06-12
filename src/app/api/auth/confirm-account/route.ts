import { NextRequest, NextResponse } from "next/server";
import { httpStatusForAuthErrors } from "@/lib/auth/auth-api-utils";
import { rejectIfRateLimited } from "@/lib/auth/auth-rate-limit";
import { confirmAccountWithToken } from "@/lib/auth/confirm-account";

interface ConfirmAccountRequest {
	email: string;
	token: string;
}

export async function POST(request: NextRequest) {
	const rateLimited = rejectIfRateLimited(request, "confirm-account", {
		limit: 10,
		windowMs: 15 * 60 * 1000,
	});
	if (rateLimited) {
		return rateLimited;
	}

	let body: ConfirmAccountRequest;
	try {
		body = (await request.json()) as ConfirmAccountRequest;
	} catch {
		return NextResponse.json(
			{ errors: [{ message: "Invalid request body", code: "INVALID_JSON" }] },
			{ status: 400 },
		);
	}

	const { email, token } = body;

	if (!email || !token) {
		return NextResponse.json(
			{ errors: [{ message: "Email and token are required", code: "REQUIRED" }] },
			{ status: 400 },
		);
	}

	const result = await confirmAccountWithToken(email, token);

	if (!result.ok) {
		return NextResponse.json({ errors: result.errors }, { status: httpStatusForAuthErrors(result.errors) });
	}

	return NextResponse.json({
		success: true,
		message: "Account confirmed successfully",
	});
}
