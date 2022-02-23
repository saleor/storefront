import queryString from "query-string";

export const getToken = (): string => {
  // eslint-disable-next-line no-restricted-globals
  const token = (
    queryString.parse(location.search) as { token?: string | null }
  )?.token;

  if (typeof token !== "string") {
    throw "Checkout token does not exist";
  }

  return token;
};
