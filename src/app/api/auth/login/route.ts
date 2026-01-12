import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LOGIN_MUTATION = `
  mutation TokenCreate($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      refreshToken
      errors {
        field
        message
        code
      }
    }
  }
`;

interface LoginRequest {
	email: string;
	password: string;
}

interface TokenCreateResponse {
	data?: {
		tokenCreate?: {
			token?: string;
			refreshToken?: string;
			errors?: Array<{ field?: string; message: string; code?: string }>;
		};
	};
	errors?: Array<{ message: string }>;
}

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as LoginRequest;
		const { email, password } = body;

		if (!email || !password) {
			return NextResponse.json(
				{ errors: [{ message: "Email and password are required", code: "REQUIRED" }] },
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
				query: LOGIN_MUTATION,
				variables: { email, password },
			}),
		});

		const data = (await response.json()) as TokenCreateResponse;

		if (data.errors) {
			return NextResponse.json(
				{ errors: data.errors.map((e) => ({ message: e.message, code: "GRAPHQL_ERROR" })) },
				{ status: 400 },
			);
		}

		const result = data.data?.tokenCreate;

		if (result?.errors?.length) {
			return NextResponse.json({ errors: result.errors }, { status: 401 });
		}

		if (result?.token && result?.refreshToken) {
			// Set auth cookies
			const cookieStore = await cookies();

			cookieStore.set("token", result.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: 60 * 60, // 1 hour
			});

			cookieStore.set("refreshToken", result.refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: 60 * 60 * 24 * 30, // 30 days
			});

			return NextResponse.json({
				token: result.token,
				message: "Successfully signed in",
			});
		}

		return NextResponse.json({ errors: [{ message: "Sign in failed", code: "UNKNOWN" }] }, { status: 500 });
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ errors: [{ message: "An unexpected error occurred", code: "SERVER_ERROR" }] },
			{ status: 500 },
		);
	}
}
