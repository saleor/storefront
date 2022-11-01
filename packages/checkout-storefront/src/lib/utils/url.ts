import { DEFAULT_CHANNEL, DEFAULT_LOCALE, Locale } from "@/checkout-storefront/lib/regions";
import { isOrderConfirmationPage } from "./utils";
import queryString from "query-string";

type AuthState = "signIn";

const rawQueryParams = ["locale", "dummyPayment", "channel", "authState", "redirectUrl"] as const;

const mappableQueryParams = ["checkout", "order", "email", "token"] as const;

type MappedQueryParam = "passwordResetEmail" | "passwordResetToken" | "checkoutId" | "orderId";

type RawQueryParam = typeof rawQueryParams[number];

type MappableQueryParam = typeof mappableQueryParams[number];

type QueryParam = RawQueryParam | MappedQueryParam;

export type QueryParams = Partial<Record<QueryParam, string>> & {
  locale: Locale;
  channel: string;
  authState?: AuthState;
};

type UnmappedQueryParam = RawQueryParam | MappableQueryParam;

type UnmappedQueryParams = Partial<Record<UnmappedQueryParam, any>>;

const queryParamsMap: Record<UnmappedQueryParam, QueryParam> = {
  ...(rawQueryParams.reduce((result, param) => ({ ...result, [param]: param }), {}) as Record<
    RawQueryParam,
    QueryParam
  >),
  checkout: "checkoutId",
  order: "orderId",
  token: "passwordResetToken",
  email: "passwordResetEmail",
};

const defaultParams: UnmappedQueryParams = {
  locale: DEFAULT_LOCALE,
  channel: DEFAULT_CHANNEL,
};

const getRawQueryParams = (): UnmappedQueryParams => queryString.parse(location.search);

export const getQueryParams = (): QueryParams => {
  const params = getRawQueryParams();

  if (typeof params.locale !== "string") {
    replaceUrl({ query: { locale: DEFAULT_LOCALE } });
  }

  return Object.entries(params).reduce((result, entry) => {
    const [unmappedParamName, paramValue] = entry as [UnmappedQueryParam, any];
    const value = paramValue || defaultParams[unmappedParamName];

    if (mappableQueryParams.includes(unmappedParamName as MappableQueryParam)) {
      return { ...result, [queryParamsMap[unmappedParamName]]: value };
    }

    return result;
  }, params) as QueryParams;
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
