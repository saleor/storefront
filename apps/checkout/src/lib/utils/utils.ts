import { reduce } from "lodash-es";
import queryString from "query-string";
import { OperationResult } from "urql";
import { envVars } from "./environment";

export const getById =
  <T extends { id: string }>(idToCompare: string | undefined) =>
  (obj: T) =>
    obj.id === idToCompare;

export const getDataWithToken = <TData extends {} = {}>(
  data: TData = {} as TData
) => ({
  token: extractCheckoutTokenFromUrl(),
  ...data,
});

export type QueryVariables = Record<
  "checkoutToken" | "passwordResetToken" | "email" | "orderToken",
  string
>;

export const getQueryVariables = (): Partial<QueryVariables> => {
  const vars = queryString.parse(location.search);
  return {
    ...vars,
    passwordResetToken: vars.token as string | undefined,
  };
};

export const getCurrentHref = () => location.href;

const extractCheckoutTokenFromUrl = (): string => {
  const { checkoutToken } = getQueryVariables();

  // for development & preview purposes
  const token = checkoutToken || envVars.devCheckoutToken;

  if (typeof token !== "string") {
    throw new Error("Checkout token does not exist");
  }

  return token;
};

export const extractMutationErrors = <TData extends Object, TVars = any>(
  result: OperationResult<TData, TVars> | any // any to cover apollo client
  // mutations, to be removed once we remove apollo client from sdk
): [boolean, any[]] => {
  const urqlErrors = result.error ? [result.error] : [];

  const graphqlErrors = reduce(
    result.data as object,
    (result, { errors }) => {
      return [...result, ...errors];
    },
    []
  );

  const errors = [...urqlErrors, ...graphqlErrors];

  return [errors.length > 0, errors];
};
