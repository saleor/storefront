import { reduce } from "lodash-es";
import queryString from "query-string";
import { ChangeEvent, ReactEventHandler } from "react";
import { OperationResult } from "urql";

export const getById =
  <T extends { id: string }>(idToCompare: string | undefined) =>
  (obj: T) =>
    obj.id === idToCompare;

export type QueryVariables = Record<
  "checkoutId" | "passwordResetToken" | "email" | "orderId" | "redirectUrl",
  string
>;

export const getQueryVariables = (): Partial<QueryVariables> => {
  const vars = queryString.parse(location.search);
  return {
    ...vars,
    checkoutId: vars.checkout as string | undefined,
    orderId: vars.order as string | undefined,
    passwordResetToken: vars.token as string | undefined,
  };
};

export const getCurrentHref = () => location.href;

export const extractCheckoutIdFromUrl = (): string => {
  const { checkoutId } = getQueryVariables();

  if (typeof checkoutId !== "string") {
    throw new Error("Checkout token does not exist");
  }

  return checkoutId;
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

export const handleInputChange =
  <TData>(callback: (value: TData) => void): ReactEventHandler<HTMLInputElement> =>
  (event: ChangeEvent<HTMLInputElement>) => {
    callback(event.target.value as unknown as TData);
  };
