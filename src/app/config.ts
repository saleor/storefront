import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { getNextServerCookiesStorage } from "@saleor/auth-sdk/next/server";
import { invariant } from "ts-invariant";

export const ProductsPerPage = 12;

const saleorApiUrl = process.env.SALEOR_API_URL;
invariant(saleorApiUrl, "Missing SALEOR_API_URL env variable");

const nextServerCookiesStorage = getNextServerCookiesStorage();
export const saleorAuthClient = createSaleorAuthClient({
	saleorApiUrl,
	refreshTokenStorage: nextServerCookiesStorage,
	accessTokenStorage: nextServerCookiesStorage,
});
