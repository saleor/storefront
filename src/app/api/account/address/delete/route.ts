import { NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";
import { AccountAddressDeleteDocument } from "@/gql/graphql";

interface DeleteRequest {
	id: string;
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as DeleteRequest;

		const result = await executeGraphQL(AccountAddressDeleteDocument, {
			variables: { id: body.id },
			cache: "no-store",
			withAuth: true,
		});

		if (result.accountAddressDelete?.errors && result.accountAddressDelete.errors.length > 0) {
			const errorMessages = result.accountAddressDelete.errors
				.map((e) => e.message)
				.filter(Boolean)
				.join(", ");
			return NextResponse.json({ message: errorMessages || "Failed to delete address" }, { status: 400 });
		}

		return NextResponse.json({ message: "Address deleted" }, { status: 200 });
	} catch (error) {
		console.error("Address delete error:", error);
		return NextResponse.json({ message: "An error occurred" }, { status: 500 });
	}
}
