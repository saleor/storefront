import { NextRequest, NextResponse } from "next/server";

const REGISTER_MUTATION = `
  mutation AccountRegister($input: AccountRegisterInput!) {
    accountRegister(input: $input) {
      user {
        id
        email
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

interface RegisterRequest {
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	channel: string;
	redirectUrl: string;
}

interface SaleorError {
	field?: string;
	message: string;
	code?: string;
}

interface RegisterResponse {
	data?: {
		accountRegister?: {
			user?: { id: string; email: string };
			errors?: SaleorError[];
		};
	};
	errors?: Array<{ message: string }>;
}

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as RegisterRequest;
		const { email, password, firstName, lastName, channel, redirectUrl } = body;

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
				query: REGISTER_MUTATION,
				variables: {
					input: {
						email,
						password,
						firstName: firstName || "",
						lastName: lastName || "",
						channel,
						redirectUrl,
					},
				},
			}),
		});

		const data = (await response.json()) as RegisterResponse;

		if (data.errors) {
			// GraphQL errors
			return NextResponse.json(
				{ errors: data.errors.map((e) => ({ message: e.message, code: "GRAPHQL_ERROR" })) },
				{ status: 400 },
			);
		}

		const result = data.data?.accountRegister;

		if (result?.errors?.length) {
			// Saleor validation errors
			return NextResponse.json({ errors: result.errors }, { status: 400 });
		}

		// Success
		return NextResponse.json({
			user: result?.user,
			message: "Account created successfully. Please check your email to verify your account.",
		});
	} catch (error) {
		// Log error type only, not full details (may contain sensitive request data)
		console.error("Registration error:", error instanceof Error ? error.name : "Unknown");
		return NextResponse.json(
			{ errors: [{ message: "An unexpected error occurred", code: "SERVER_ERROR" }] },
			{ status: 500 },
		);
	}
}
