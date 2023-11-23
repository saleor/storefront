import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { getNextServerCookiesStorage } from "@saleor/auth-sdk/next/server";
import { invariant } from "ts-invariant";

const nextServerCookiesStorage = getNextServerCookiesStorage();

invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

export const authClient = createSaleorAuthClient({
	saleorApiUrl: process.env.NEXT_PUBLIC_SALEOR_API_URL,
	refreshTokenStorage: nextServerCookiesStorage,
	accessTokenStorage: nextServerCookiesStorage,
});
