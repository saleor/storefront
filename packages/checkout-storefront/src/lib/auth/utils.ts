import { DocumentNode } from "graphql";

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

export const getRequestData = <TVars extends object>(query: DocumentNode, variables: TVars) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query, variables }),
});
