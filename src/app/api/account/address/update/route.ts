import { NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";
import { AccountAddressUpdateDocument, type CountryCode } from "@/gql/graphql";

interface AddressUpdateRequest {
	id: string;
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
		const body = (await request.json()) as AddressUpdateRequest;

		const result = await executeGraphQL(AccountAddressUpdateDocument, {
			variables: {
				id: body.id,
				input: {
					firstName: body.firstName,
					lastName: body.lastName,
					streetAddress1: body.streetAddress1,
					streetAddress2: body.streetAddress2 || "",
					city: body.city,
					postalCode: body.postalCode,
					country: body.country as CountryCode,
					phone: body.phone || "",
				},
			},
			cache: "no-store",
			withAuth: true,
		});

		if (result.accountAddressUpdate?.errors && result.accountAddressUpdate.errors.length > 0) {
			const errorMessages = result.accountAddressUpdate.errors
				.map((e) => e.message)
				.filter(Boolean)
				.join(", ");
			return NextResponse.json({ message: errorMessages || "Failed to update address" }, { status: 400 });
		}

		return NextResponse.json(
			{ message: "Address updated", address: result.accountAddressUpdate?.address },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Address update error:", error);
		return NextResponse.json({ message: "An error occurred" }, { status: 500 });
	}
}
