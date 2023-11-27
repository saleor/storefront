"use server";

import { saleorAuthClient } from "@/app/config";

export async function logout() {
	"use server";
	saleorAuthClient.signOut();
}
