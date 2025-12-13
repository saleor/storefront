import { NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";
import { PasswordChangeDocument } from "@/gql/graphql";

interface PasswordChangeRequest {
	oldPassword: string;
	newPassword: string;
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as PasswordChangeRequest;
		const { oldPassword, newPassword } = body;

		if (!oldPassword || !newPassword) {
			return NextResponse.json({ message: "Both passwords are required" }, { status: 400 });
		}

		if (newPassword.length < 8) {
			return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
		}

		const result = await executeGraphQL(PasswordChangeDocument, {
			variables: { oldPassword, newPassword },
			cache: "no-store",
			withAuth: true,
		});

		if (result.passwordChange?.errors && result.passwordChange.errors.length > 0) {
			const errorMessages = result.passwordChange.errors
				.map((e) => e.message)
				.filter(Boolean)
				.join(", ");
			return NextResponse.json({ message: errorMessages || "Password change failed" }, { status: 400 });
		}

		return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });
	} catch (error) {
		console.error("Password change error:", error);
		return NextResponse.json({ message: "An error occurred" }, { status: 500 });
	}
}
