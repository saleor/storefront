import { CHECKOUT_CUSTOMER_DETACH, REFRESH_TOKEN, TOKEN_CREATE } from "./mutations";
import { print } from "graphql/language/printer";

const MILLI_MULTIPLYER = 1000;

// returns timestamp
const getTokenExpiry = (token: string): number => {
  const tokenParts = token.split(".");
  const decodedTokenData = Buffer.from(tokenParts[1] || "", "base64").toString();
  const parsedTokenData = JSON.parse(decodedTokenData);

  // because api returns seconds, but Date.now() works in millis
  return parsedTokenData.exp * MILLI_MULTIPLYER || 0;
};

export const isExpiredToken = (token: string) => {
  // we'll assume a generous time of 2 seconds for api to
  // process our request
  return getTokenExpiry(token) - 2000 <= Date.now();
};

export const getTokenRefreshRequest = (refreshToken: string) =>
  getRequestData(
    JSON.stringify({
      query: print(REFRESH_TOKEN),
      variables: { refreshToken },
    })
  );

export const getCustomerDetachRequest = (checkoutId: string) =>
  getRequestData(
    JSON.stringify({ query: print(CHECKOUT_CUSTOMER_DETACH), variables: { checkoutId } })
  );

export const getTokenCreateRequest = (email: string, password: string) =>
  getRequestData(JSON.stringify({ query: print(TOKEN_CREATE), variables: { email, password } }));

const getRequestData = (body = "") => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body,
});
