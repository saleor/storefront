import { NextResponse } from "next/server";
import { getServerAuthClient } from "@/app/config";

interface LoginRequest {
	email: string;
	password: string;
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as LoginRequest;
		const { email, password } = body;

		// Validate required fields
		if (!email || !password) {
			return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
		}

		// Get the auth client
		const authClient = await getServerAuthClient();

		// Attempt to sign in
		const result = await authClient.signIn({ email, password }, { cache: "no-store" });

		// Check for errors
		if (result.data?.tokenCreate?.errors && result.data.tokenCreate.errors.length > 0) {
			const errorMessages = result.data.tokenCreate.errors
				.map((e: { message?: string }) => e.message)
				.filter(Boolean)
				.join(", ");

			return NextResponse.json({ message: errorMessages || "Invalid email or password" }, { status: 401 });
		}

		// Check if we got a token
		if (!result.data?.tokenCreate?.token) {
			return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
		}

		// Success
		return NextResponse.json(
			{
				message: "Login successful",
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json({ message: "An error occurred during login" }, { status: 500 });
	}
}
