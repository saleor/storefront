import { NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";
import { DefaultChannelSlug } from "@/app/config";

// GraphQL mutation for account registration
const AccountRegisterDocument = /* GraphQL */ `
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
`;

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

		// Call Saleor API to register user
		const result = await executeGraphQL<AccountRegisterResponse, { input: object }>(
			AccountRegisterDocument as unknown as Parameters<typeof executeGraphQL>[0],
			{
				variables: {
					input: {
						email,
						password,
						firstName: firstName || "",
						lastName: lastName || "",
						channel: DefaultChannelSlug,
						redirectUrl: `${process.env.NEXT_PUBLIC_STOREFRONT_URL || ""}/account/confirm`,
					},
				},
				cache: "no-store",
			},
		);

		const { accountRegister } = result;

		// Check for errors
		if (accountRegister.errors && accountRegister.errors.length > 0) {
			const errorMessages = accountRegister.errors
				.map((e) => e.message)
				.filter(Boolean)
				.join(", ");

			// Check for specific error codes
			const duplicateEmail = accountRegister.errors.some(
				(e) => e.code === "UNIQUE" || e.code === "DUPLICATED_INPUT_ITEM",
			);

			if (duplicateEmail) {
				return NextResponse.json({ message: "An account with this email already exists" }, { status: 400 });
			}

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
