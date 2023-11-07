import queryString from "query-string";
import { DEFAULT_CHANNEL } from "@/checkout/lib/regions";
import { type CountryCode } from "@/checkout/graphql";
import { type MightNotExist } from "@/checkout/lib/globalTypes";

export type ParamBasicValue = MightNotExist<string>;

const queryParamsMap = {
	redirectUrl: "redirectUrl",
	checkout: "checkoutId",
	order: "orderId",
	token: "passwordResetToken",
	email: "passwordResetEmail",
	saleorApiUrl: "saleorApiUrl",
	// payment flow
	transaction: "transaction", // allows us to process started transaction
	processingPayment: "processingPayment", // tell the processing screen to show up
	// adyen
	redirectResult: "redirectResult",
	resultCode: "resultCode",
	type: "type",
} as const;

type UnmappedQueryParam = keyof typeof queryParamsMap;

type QueryParam = (typeof queryParamsMap)[UnmappedQueryParam];

interface CustomTypedQueryParams {
	countryCode: CountryCode;
	channel: string;
	saleorApiUrl: string;
}

type RawQueryParams = Record<UnmappedQueryParam, ParamBasicValue> & CustomTypedQueryParams;

export type QueryParams = Record<QueryParam, ParamBasicValue> & CustomTypedQueryParams;

const defaultParams: Partial<RawQueryParams> = {
	channel: DEFAULT_CHANNEL,
};

// this is intentional, we know what we'll get from the query but
// queryString has no way to type this in such a specific way
export const getRawQueryParams = () => queryString.parse(location.search) as unknown as RawQueryParams;

export const getQueryParams = (): QueryParams => {
	const params = getRawQueryParams();

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

export const getUrl = ({
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
	return { newUrl, newQuery };
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
	const { newUrl, newQuery } = getUrl({ url, query, replaceWholeQuery });

	window.history.pushState(
		{
			...window.history.state,
			...newQuery,
			url: newUrl,
			as: newUrl,
		},
		"",
		newUrl,
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

export const isOrderConfirmationPage = () => {
	const { orderId } = getQueryParams();
	return typeof orderId === "string";
};
