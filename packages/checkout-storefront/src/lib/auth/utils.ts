import { REFRESH_TOKEN } from "@/checkout-storefront/lib/auth/mutations";
import { print } from "graphql/language/printer";

const MILLI_MULTIPLYER = 1000;

// returns timestamp
const getTokenExpiry = (token: string): number => {
  const tokenParts = token.split(".");
  const decodedTokenData = Buffer.from(tokenParts[1] || "", "base64").toString();
  const parsedTokenData = JSON.parse(decodedTokenData);

  return parsedTokenData.exp * MILLI_MULTIPLYER || 0;
};

export const isExpiredToken = (token: string) => {
  // we'll assume api needing some time to process our request
  return getTokenExpiry(token) - 2 <= Date.now();
};

export const refreshTokenRequest = (saleorApiUrl: string, refreshToken: string) =>
  fetch(saleorApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: print(REFRESH_TOKEN),
      variables: { refreshToken },
    }),
  });
