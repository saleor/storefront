"use server";

import { saleorAuthClient } from "@/lib/graphql";

export async function logout() {
	"use server";
	saleorAuthClient.signOut();
}
