import { NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";
import { AccountAddressCreateDocument } from "@/gql/graphql";

interface AddressRequest {
	firstName: string;
	lastName: string;
	streetAddress1: string;
	streetAddress2?: string;
	city: string;
	postalCode: string;
	country: string;
	phone?: string;
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as AddressRequest;

		const result = await executeGraphQL(AccountAddressCreateDocument, {
			variables: {
				input: {
					firstName: body.firstName,
					lastName: body.lastName,
					streetAddress1: body.streetAddress1,
					streetAddress2: body.streetAddress2 || "",
					city: body.city,
					postalCode: body.postalCode,
					country: body.country,
					phone: body.phone || "",
				},
			},
			cache: "no-store",
			withAuth: true,
		});

		if (result.accountAddressCreate?.errors && result.accountAddressCreate.errors.length > 0) {
			const errorMessages = result.accountAddressCreate.errors
				.map((e) => e.message)
				.filter(Boolean)
				.join(", ");
			return NextResponse.json({ message: errorMessages || "Failed to create address" }, { status: 400 });
		}

		return NextResponse.json(
			{ message: "Address created", address: result.accountAddressCreate?.address },
			{ status: 201 },
		);
	} catch (error) {
		console.error("Address create error:", error);
		return NextResponse.json({ message: "An error occurred" }, { status: 500 });
	}
}
