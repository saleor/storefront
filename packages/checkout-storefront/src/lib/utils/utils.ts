import { CountryCode } from "@/checkout-storefront/graphql";
import { getCountryByCountryCode } from "@/checkout-storefront/sections/Addresses/countries";
import { reduce } from "lodash-es";
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
    "checkoutId" | "passwordResetToken" | "email" | "orderId" | "redirectUrl" | "locale",
    string
  >
> & { countryCode: CountryCode };

export const getQueryVariables = (): QueryVariables => {
  const vars = queryString.parse(location.search);
  return {
    ...vars,
    checkoutId: vars.checkout as string | undefined,
    orderId: vars.order as string | undefined,
    passwordResetToken: vars.token as string | undefined,
  } as QueryVariables;
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
