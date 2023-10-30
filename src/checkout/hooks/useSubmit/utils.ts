/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type CombinedError } from "urql";
import { compact } from "lodash-es";
import { type FormDataBase } from "@/checkout/hooks/useForm";
import { type ApiErrors } from "@/checkout/hooks/useGetParsedErrors";
import {
	type MutationBaseFn,
	type MutationData,
	type MutationResultData,
	type MutationSuccessData,
} from "@/checkout/hooks/useSubmit/types";
import { type MightNotExist } from "@/checkout/lib/globalTypes";

type SuccessDataReturn<TMutationFn extends MutationBaseFn> =
	| {
			success: true;
			data: MutationSuccessData<TMutationFn>;
	  }
	| {
			success: false;
			data: null;
	  };

export const extractMutationData = <TMutationFn extends MutationBaseFn>(
	result: MutationData<TMutationFn>,
): SuccessDataReturn<TMutationFn> => {
	const failedResponse: SuccessDataReturn<TMutationFn> = { success: false, data: null };

	if (result.data) {
		const data: MutationResultData<TMutationFn> = result.data;

		try {
			const mutationNameKey = Object.keys(data as Record<string, any>).filter(
				(key) => !["__typename"].includes(key),
			)?.[0];

			if (mutationNameKey) {
				const mutationReturnData = result.data[mutationNameKey];

				if (mutationReturnData) {
					return { success: true, data: mutationReturnData };
				}
			}
		} catch (e) {
			return failedResponse;
		}
	}

	return failedResponse;
};

export type ExtractedMutationErrors<TData extends FormDataBase, TErrorCodes extends string = string> = {
	hasErrors: boolean;
	apiErrors: ApiErrors<TData, TErrorCodes>;
	graphqlErrors: CombinedError[];
	customErrors: any[];
};

export const extractMutationErrors = <
	TData extends FormDataBase,
	TMutationFn extends MutationBaseFn,
	TErrorCodes extends string = string,
>(
	result: MutationData<TMutationFn>,
	extractCustomErrors?: (result: MutationData<TMutationFn>) => MightNotExist<any[]>,
): ExtractedMutationErrors<TData, TErrorCodes> => {
	const graphqlErrors = result?.error ? [result.error] : [];

	const apiErrors = result?.data
		? Object.values(result.data as Record<string, { errors: ApiErrors<TData, TErrorCodes> }>).reduce(
				(result, { errors }) => [...result, ...errors],
				[] as ApiErrors<TData, TErrorCodes>,
		  )
		: [];

	const customErrors = extractCustomErrors?.(result) || [];

	const allErrors = compact([...apiErrors, ...graphqlErrors, ...customErrors]);

	return { hasErrors: allErrors.length > 0, apiErrors, graphqlErrors, customErrors };
};
