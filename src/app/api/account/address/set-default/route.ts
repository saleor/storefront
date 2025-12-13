import { NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";
import { AccountSetDefaultAddressDocument, AddressTypeEnum } from "@/gql/graphql";

interface SetDefaultRequest {
	id: string;
	type: "SHIPPING" | "BILLING";
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as SetDefaultRequest;

		const result = await executeGraphQL(AccountSetDefaultAddressDocument, {
			variables: {
				id: body.id,
				type: body.type as AddressTypeEnum,
			},
			cache: "no-store",
			withAuth: true,
		});

		if (result.accountSetDefaultAddress?.errors && result.accountSetDefaultAddress.errors.length > 0) {
			const errorMessages = result.accountSetDefaultAddress.errors
				.map((e) => e.message)
				.filter(Boolean)
				.join(", ");
			return NextResponse.json(
				{ message: errorMessages || "Failed to set default address" },
				{ status: 400 },
			);
		}

		return NextResponse.json({ message: "Default address updated" }, { status: 200 });
	} catch (error) {
		console.error("Set default address error:", error);
		return NextResponse.json({ message: "An error occurred" }, { status: 500 });
	}
}
