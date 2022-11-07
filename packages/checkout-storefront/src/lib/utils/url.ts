import { DEFAULT_CHANNEL, DEFAULT_LOCALE, Locale } from "@/checkout-storefront/lib/regions";
import { isOrderConfirmationPage } from "./utils";
import queryString from "query-string";
import { CountryCode } from "@/checkout-storefront/graphql";

type ParamBasicValue = string | undefined | null;

const queryParamsMap = {
  locale: "locale",
  dummyPayment: "dummyPayment",
  channel: "channel",
  redirectUrl: "redirectUrl",
  checkout: "checkoutId",
  order: "orderId",
  token: "passwordResetToken",
  email: "passwordResetEmail",
} as const;

type UnmappedQueryParam = keyof typeof queryParamsMap;

type QueryParam = typeof queryParamsMap[UnmappedQueryParam];

interface CustomTypedQueryParams {
  countryCode: CountryCode;
  locale: Locale;
  channel: string;
}

type RawQueryParams = Record<UnmappedQueryParam, ParamBasicValue> & CustomTypedQueryParams;

export type QueryParams = Record<QueryParam, ParamBasicValue> & CustomTypedQueryParams;

const defaultParams: Partial<RawQueryParams> = {
  locale: DEFAULT_LOCALE,
  channel: DEFAULT_CHANNEL,
};

// this is intentional, we know what we'll get from the query but
// queryString has no way to type this in such a specific way
export const getRawQueryParams = () =>
  queryString.parse(location.search) as unknown as RawQueryParams;

export const getQueryParams = (): QueryParams => {
  const params = getRawQueryParams();

  if (typeof params.locale !== "string") {
    replaceUrl({ query: { locale: DEFAULT_LOCALE } });
  }

  return Object.entries(params).reduce((result, entry) => {
    const [paramName, paramValue] = entry as [UnmappedQueryParam, ParamBasicValue];
    const mappedParamName = queryParamsMap[paramName];
    const mappedParamValue = paramValue || defaultParams[paramName];

    return {
      ...result,
      [mappedParamName]: mappedParamValue,
    };
  }, {}) as QueryParams;
};

export const clearQueryParams = (...keys: QueryParam[]) => {
  const query = Object.entries(queryParamsMap).reduce((result, [unmappedParam, mappedParam]) => {
    if (!keys.includes(mappedParam)) {
      return result;
    }

    return { ...result, [unmappedParam]: undefined };
  }, {});

  replaceUrl({ query });
};

export const replaceUrl = ({
  url = window.location.toString(),
  query,
  replaceWholeQuery = false,
}: {
  url?: string;
  query?: Record<string, any>;
  replaceWholeQuery?: boolean;
}) => {
  const newQuery = replaceWholeQuery ? query : { ...getRawQueryParams(), ...query };
  const newUrl = queryString.stringifyUrl({ url, query: newQuery });

  window.history.pushState(
    {
      ...window.history.state,
      ...newQuery,
      url: newUrl,
      as: newUrl,
    },
    "",
    newUrl
  );

  return newUrl;
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
