import { NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";
import { AccountUpdateDocument } from "@/gql/graphql";

interface UpdateRequest {
	firstName: string;
	lastName: string;
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as UpdateRequest;
		const { firstName, lastName } = body;

		const result = await executeGraphQL(AccountUpdateDocument, {
			variables: {
				input: { firstName, lastName },
			},
			cache: "no-store",
			withAuth: true,
		});

		if (result.accountUpdate?.errors && result.accountUpdate.errors.length > 0) {
			const errorMessages = result.accountUpdate.errors
				.map((e) => e.message)
				.filter(Boolean)
				.join(", ");
			return NextResponse.json({ message: errorMessages || "Update failed" }, { status: 400 });
		}

		return NextResponse.json(
			{ message: "Profile updated", user: result.accountUpdate?.user },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Account update error:", error);
		return NextResponse.json({ message: "An error occurred" }, { status: 500 });
	}
}
