import { ApiErrors } from "@/checkout-storefront/hooks/useGetParsedErrors/types";
import { FormDataBase } from "@/checkout-storefront/hooks/useForm";
import { reduce } from "lodash-es";
import { AnyVariables, OperationResult } from "urql";
import { string } from "yup";

export const getById =
  <T extends { id: string }>(idToCompare: string | undefined) =>
  (obj: T) =>
    obj.id === idToCompare;

export const getByUnmatchingId =
  <T extends { id: string }>(idToCompare: string | undefined) =>
  (obj: T) =>
    obj.id !== idToCompare;

export const extractMutationErrors = <
  TData extends FormDataBase,
  TErrorCodes extends string = string,
  TVars extends AnyVariables = any
>(
  result: OperationResult<TData, TVars> | any // any to cover apollo client
  // mutations, to be removed once we remove apollo client from sdk
): [boolean, ApiErrors<TData, TErrorCodes>] => {
  const urqlErrors = result?.error ? [result.error] : [];

  const graphqlErrors = reduce(
    (result?.data || {}) as object,
    (result, { errors = [] }) => {
      return [...result, ...errors];
    },
    []
  );

  const errors = [...urqlErrors, ...graphqlErrors];

  return [errors.length > 0, errors];
};

export const isValidEmail = async (email: string) => {
  return string().required().email().isValidSync(email);
};
