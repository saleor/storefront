import queryString from "query-string";

export const extractTokenFromUrl = (): string => {
  const token =
    // eslint-disable-next-line no-restricted-globals
    (queryString.parse(location.search) as { token?: string | null })?.token ||
    // for development & preview purposes
    process.env.REACT_APP_TEST_CHECKOUT_TOKEN;

  if (typeof token !== "string") {
    throw "Checkout token does not exist";
  }

  return token;
};
