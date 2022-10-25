import { CountryCode, LanguageCodeEnum } from "@/checkout-storefront/graphql";
import { ApiErrors } from "@/checkout-storefront/hooks";
import { FormDataBase } from "@/checkout-storefront/lib/globalTypes";
import { DEFAULT_LOCALE, Locale } from "@/checkout-storefront/lib/regions";
import { reduce, snakeCase } from "lodash-es";
import queryString from "query-string";
import { ChangeEvent, ReactEventHandler } from "react";
import { AnyVariables, OperationResult } from "urql";

export const getById =
  <T extends { id: string }>(idToCompare: string | undefined) =>
  (obj: T) =>
    obj.id === idToCompare;

export const getByUnmatchingId =
  <T extends { id: string }>(idToCompare: string | undefined) =>
  (obj: T) =>
    obj.id !== idToCompare;

export type QueryParams = Partial<
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
> & { countryCode: CountryCode; locale: Locale };

export const getRawQueryParams = () => queryString.parse(location.search);

export const getQueryParams = (): QueryParams => {
  const vars = getRawQueryParams();

  if (typeof vars.locale !== "string") {
    replaceUrl({ query: { ...vars, locale: DEFAULT_LOCALE } });
  }

  return {
    ...vars,
    locale: vars.locale || (DEFAULT_LOCALE as Locale),
    checkoutId: vars.checkout as string | undefined,
    orderId: vars.order as string | undefined,
    passwordResetToken: vars.token as string | undefined,
    dummyPayment: vars.dummyPayment as "true" | undefined,
  } as QueryParams;
};

export const setLanguageInUrl = (locale: Locale) =>
  replaceUrl({ query: { ...getRawQueryParams(), locale } });

export const clearUrlAfterPasswordReset = (): void => {
  replaceUrl({ query: { ...getRawQueryParams(), token: undefined, email: undefined } });
};

export const localeToLanguageCode = (locale: Locale) =>
  snakeCase(locale).toUpperCase() as LanguageCodeEnum;

export const replaceUrl = ({
  url = window.location.toString(),
  query,
}: {
  url?: string;
  query?: Record<string, any>;
}) => {
  const newUrl = queryString.stringifyUrl({ url, query });

  window.history.pushState(
    {
      ...window.history.state,
      ...query,
      url: newUrl,
      as: newUrl,
    },
    "",
    newUrl
  );

  return newUrl;
};

export const getCurrentHref = () => location.href;

export const isOrderConfirmationPage = () => {
  const { orderId } = getQueryParams();
  return typeof orderId === "string";
};

export const getParsedLocaleData = (
  locale: Locale
): { locale: Locale; countryCode: CountryCode } => {
  const [, countryCode] = locale?.split("-");

  return { countryCode: countryCode as CountryCode, locale };
};

export const extractCheckoutIdFromUrl = (): string => {
  const { checkoutId } = getQueryParams();

  if (isOrderConfirmationPage()) {
    return "";
  }

  if (typeof checkoutId !== "string") {
    throw new Error("Checkout token does not exist");
  }

  return checkoutId;
};

export const extractMutationErrors = <TData extends FormDataBase, TVars extends AnyVariables = any>(
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
