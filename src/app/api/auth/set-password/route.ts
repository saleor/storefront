import { NextRequest, NextResponse } from "next/server";
import { httpStatusForAuthErrors } from "@/lib/auth/auth-api-utils";
import { rejectIfRateLimited } from "@/lib/auth/auth-rate-limit";
import { resetPasswordWithToken } from "@/lib/auth/bff-server";

interface SetPasswordRequest {
	email: string;
	token: string;
	password: string;
}

export async function POST(request: NextRequest) {
	const rateLimited = rejectIfRateLimited(request, "set-password");
	if (rateLimited) {
		return rateLimited;
	}

	let body: SetPasswordRequest;
	try {
		body = (await request.json()) as SetPasswordRequest;
	} catch {
		return NextResponse.json(
			{ errors: [{ message: "Invalid request body", code: "INVALID_JSON" }] },
			{ status: 400 },
		);
	}

	const { email, token, password } = body;

	if (!email || !token || !password) {
		return NextResponse.json(
			{ errors: [{ message: "Email, token, and password are required", code: "REQUIRED" }] },
			{ status: 400 },
		);
	}

	if (password.length < 8) {
		return NextResponse.json(
			{ errors: [{ message: "Password must be at least 8 characters", code: "PASSWORD_TOO_SHORT" }] },
			{ status: 400 },
		);
	}

	const result = await resetPasswordWithToken(email, token, password);

	if (!result.ok) {
		return NextResponse.json({ errors: result.errors }, { status: httpStatusForAuthErrors(result.errors) });
	}

	return NextResponse.json({
		success: true,
		message: "Password updated successfully",
	});
}
