import { NextRequest, NextResponse } from "next/server";
import { httpStatusForAuthErrors } from "@/lib/auth/auth-api-utils";
import { rejectIfRateLimited } from "@/lib/auth/auth-rate-limit";
import { signInWithPassword } from "@/lib/auth/bff-server";

interface LoginRequest {
	email: string;
	password: string;
}

export async function POST(request: NextRequest) {
	const rateLimited = rejectIfRateLimited(request, "login");
	if (rateLimited) {
		return rateLimited;
	}

	let body: LoginRequest;
	try {
		body = (await request.json()) as LoginRequest;
	} catch {
		return NextResponse.json(
			{ errors: [{ message: "Invalid request body", code: "INVALID_JSON" }] },
			{ status: 400 },
		);
	}

	const { email, password } = body;

	if (!email || !password) {
		return NextResponse.json(
			{ errors: [{ message: "Email and password are required", code: "REQUIRED" }] },
			{ status: 400 },
		);
	}

	const result = await signInWithPassword(email, password);

	if (!result.ok) {
		return NextResponse.json({ errors: result.errors }, { status: httpStatusForAuthErrors(result.errors) });
	}

	return NextResponse.json({ ok: true });
}
