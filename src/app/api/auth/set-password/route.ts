import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const SET_PASSWORD_MUTATION = `
  mutation SetPassword($email: String!, $token: String!, $password: String!) {
    setPassword(email: $email, token: $token, password: $password) {
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

interface SetPasswordRequest {
	email: string;
	token: string;
	password: string;
}

interface SetPasswordResponse {
	data?: {
		setPassword?: {
			token?: string;
			refreshToken?: string;
			errors?: Array<{ field?: string; message: string; code?: string }>;
		};
	};
	errors?: Array<{ message: string }>;
}

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as SetPasswordRequest;
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
				query: SET_PASSWORD_MUTATION,
				variables: { email, token, password },
			}),
		});

		const data = (await response.json()) as SetPasswordResponse;

		if (data.errors) {
			console.error("GraphQL errors:", data.errors);
			return NextResponse.json(
				{ errors: data.errors.map((e) => ({ message: e.message, code: "GRAPHQL_ERROR" })) },
				{ status: 400 },
			);
		}

		const result = data.data?.setPassword;

		if (result?.errors?.length) {
			console.error("Set password errors:", result.errors);
			return NextResponse.json({ errors: result.errors }, { status: 400 });
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
				success: true,
				token: result.token,
				message: "Password updated successfully",
			});
		}

		return NextResponse.json(
			{ errors: [{ message: "Failed to set password", code: "UNKNOWN" }] },
			{ status: 500 },
		);
	} catch (error) {
		console.error("Set password error:", error);
		return NextResponse.json(
			{ errors: [{ message: "An unexpected error occurred", code: "SERVER_ERROR" }] },
			{ status: 500 },
		);
	}
}
