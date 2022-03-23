/* eslint-disable no-restricted-globals */
import queryString from "query-string";

export const getDataWithToken = <TData extends {} = {}>(
  data: TData = {} as TData
) => ({
  token: extractCheckoutTokenFromUrl(),
  ...data,
});

export type QueryVariables = Record<
  "checkoutToken" | "passwordResetToken" | "email",
  string
>;

export const getQueryVariables = (): Partial<QueryVariables> => {
  const vars = queryString.parse(location.search);
  return { ...vars, passwordResetToken: vars.token as string | undefined };
};

export const getCurrentHref = () => location.href;

const extractCheckoutTokenFromUrl = (): string => {
  const { checkoutToken } = getQueryVariables();

  // for development & preview purposes
  const token = checkoutToken || process.env.REACT_APP_TEST_CHECKOUT_TOKEN;

  if (typeof token !== "string") {
    throw new Error("Checkout token does not exist");
  }

  return token;
};
