import { CountryCode } from "@/checkout-storefront/graphql";
import { ApiErrors } from "@/checkout-storefront/hooks";
import { getCountryByCountryCode } from "@/checkout-storefront/lib/consts";
import { FormDataBase } from "@/checkout-storefront/lib/globalTypes";
import { omit, reduce } from "lodash-es";
import queryString from "query-string";
import { ChangeEvent, ReactEventHandler } from "react";
import { OperationResult } from "urql";

export const getById =
  <T extends { id: string }>(idToCompare: string | undefined) =>
  (obj: T) =>
    obj.id === idToCompare;

export const getByUnmatchingId =
  <T extends { id: string }>(idToCompare: string | undefined) =>
  (obj: T) =>
    obj.id !== idToCompare;

export type QueryVariables = Partial<
  Record<
    | "checkoutId"
    | "passwordResetToken"
    | "email"
    | "orderId"
    | "redirectUrl"
    | "locale"
    | "dummyPayment",
    string
  >
> & { countryCode: CountryCode };

const getRawQueryParams = () => queryString.parse(location.search);

export const getQueryVariables = (): QueryVariables => {
  const vars = getRawQueryParams();
  return {
    ...vars,
    checkoutId: vars.checkout as string | undefined,
    orderId: vars.order as string | undefined,
    passwordResetToken: vars.token as string | undefined,
    dummyPayment: vars.dummyPayment as "true" | undefined,
  } as QueryVariables;
};

export const clearUrlAfterPasswordReset = (): void => {
  const query = omit(getRawQueryParams(), ["token", "email"]);
  const newUrl = queryString.stringifyUrl({ url: window.location.origin, query });
  window.history.replaceState(
    {
      ...window.history.state,
      url: newUrl,
      as: newUrl,
    },
    "",
    newUrl
  );
};

export const getCurrentHref = () => location.href;

export const isOrderConfirmationPage = () => {
  const { orderId } = getQueryVariables();
  return typeof orderId === "string";
};

export const getLocalizationDataFromUrl = () => {
  const { /*channel*/ locale } = getQueryVariables();

  if (typeof locale !== "string") {
    throw new Error("Invalid url");
  }

  const [, /*language*/ countryCode] = locale?.split("-");

  return { country: getCountryByCountryCode(countryCode as CountryCode) };
};

export const extractCheckoutIdFromUrl = (): string => {
  const { checkoutId } = getQueryVariables();

  if (isOrderConfirmationPage()) {
    return "";
  }

  if (typeof checkoutId !== "string") {
    throw new Error("Checkout token does not exist");
  }

  return checkoutId;
};

export const extractMutationErrors = <TData extends FormDataBase, TVars = any>(
  result: OperationResult<TData, TVars> | any // any to cover apollo client
  // mutations, to be removed once we remove apollo client from sdk
): [boolean, ApiErrors<TData>] => {
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
