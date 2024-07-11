"use server";

import { getServerAuthClient } from "@/app/config";
import { executeGraphQL } from "@/lib/graphql";
import { AccountConfirmationDocument, RegisterDocument } from "@/gql/graphql";

export async function logout() {
	"use server";
	getServerAuthClient().signOut();
}

export async function registerUser(email: string, password: string, channel: string, redirectUrl: string) {
	const result = await executeGraphQL(RegisterDocument, {
		variables: { email, password, channel, redirectUrl },
	});

	return result;
}

export async function emailConfirmation(email: string, token: string) {
	const result = await executeGraphQL(AccountConfirmationDocument, {
		variables: { email, token },
	});

	return result;
}
