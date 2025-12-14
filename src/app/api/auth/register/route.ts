import { NextResponse } from "next/server";
import { DefaultChannelSlug } from "@/app/config";
import { invariant } from "ts-invariant";

interface RegisterRequest {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

interface AccountRegisterResponse {
	accountRegister: {
		user: {
			id: string;
			email: string;
			firstName: string;
			lastName: string;
		} | null;
		errors: Array<{
			field: string | null;
			message: string | null;
			code: string;
		}>;
	};
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as RegisterRequest;
		const { email, password, firstName, lastName } = body;

		// Validate required fields
		if (!email || !password) {
			return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
		}

		const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
		invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL");

		// Call Saleor API directly
		const response = await fetch(saleorApiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				query: `
					mutation AccountRegister($input: AccountRegisterInput!) {
						accountRegister(input: $input) {
							user {
								id
								email
								firstName
								lastName
							}
							errors {
								field
								message
								code
							}
						}
					}
				`,
				variables: {
					input: {
						email,
						password,
						firstName: firstName || "",
						lastName: lastName || "",
						channel: DefaultChannelSlug,
						// Only include redirectUrl if STOREFRONT_URL is set
						...(process.env.NEXT_PUBLIC_STOREFRONT_URL && {
							redirectUrl: `${process.env.NEXT_PUBLIC_STOREFRONT_URL}/account/confirm`,
						}),
					},
				},
			}),
		});

		const result = (await response.json()) as { data?: AccountRegisterResponse; errors?: Array<{ message: string }> };
		
		// Check for GraphQL errors
		if (result.errors && result.errors.length > 0) {
			console.error("GraphQL errors:", result.errors);
			return NextResponse.json({ message: result.errors[0].message || "Registration failed" }, { status: 400 });
		}

		if (!result.data) {
			return NextResponse.json({ message: "Registration failed - no response from server" }, { status: 500 });
		}

		const { accountRegister } = result.data;

		// Check for errors
		if (accountRegister.errors && accountRegister.errors.length > 0) {
			console.error("Account register errors:", accountRegister.errors);
			
			// Check for specific error codes
			const duplicateEmail = accountRegister.errors.some(
				(e) => e.code === "UNIQUE" || e.code === "DUPLICATED_INPUT_ITEM",
			);

			if (duplicateEmail) {
				return NextResponse.json({ message: "An account with this email already exists" }, { status: 400 });
			}

			// Check for password errors
			const passwordError = accountRegister.errors.find((e) => e.field === "password");
			if (passwordError) {
				return NextResponse.json({ 
					message: passwordError.message || "Password does not meet requirements. Use at least 8 characters with letters and numbers." 
				}, { status: 400 });
			}

			const errorMessages = accountRegister.errors
				.map((e) => e.message)
				.filter(Boolean)
				.join(", ");

			return NextResponse.json({ message: errorMessages || "Registration failed" }, { status: 400 });
		}

		// Success
		return NextResponse.json(
			{
				message: "Account created successfully. Please check your email to confirm your account.",
				user: accountRegister.user,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Registration error:", error);
		return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 });
	}
}
