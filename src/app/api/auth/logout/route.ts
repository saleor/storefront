import { NextResponse } from "next/server";
import { getServerAuthClient } from "@/app/config";

export async function POST() {
	try {
		const authClient = await getServerAuthClient();
		await authClient.signOut();

		return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json({ message: "An error occurred during logout" }, { status: 500 });
	}
}
