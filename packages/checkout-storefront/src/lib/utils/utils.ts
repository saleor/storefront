import { CountryCode, LanguageCodeEnum } from "@/checkout-storefront/graphql";
import { ApiErrors } from "@/checkout-storefront/hooks";
import { FormDataBase } from "@/checkout-storefront/lib/globalTypes";
import { Locale } from "@/checkout-storefront/lib/regions";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";
import { reduce, snakeCase } from "lodash-es";
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

export const localeToLanguageCode = (locale: Locale) =>
  snakeCase(locale).toUpperCase() as LanguageCodeEnum;

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
