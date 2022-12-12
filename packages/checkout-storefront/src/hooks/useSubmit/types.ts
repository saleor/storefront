import { Exact, LanguageCodeEnum } from "@/checkout-storefront/graphql";
import { ApiErrors } from "@/checkout-storefront/hooks/useErrors";
import { FormDataBase } from "@/checkout-storefront/hooks/useForm";
import { FormikHelpers, useFormik } from "formik";

export type UseFormReturn<TData extends FormDataBase> = ReturnType<typeof useFormik<TData>>;

export type MutationVars<MutationFn> = MutationFn extends (vars: Exact<infer Vars>) => any
  ? Vars
  : never;
export type MutationData<MutationFn> = MutationFn extends (vars: any) => Promise<infer Data>
  ? Data
  : never;

const commonVars = ["languageCode", "channel", "checkoutId"] as const;
export type CommonVar = typeof commonVars[number];

export type CommonVars = Record<CommonVar, string> & { languageCode: LanguageCodeEnum };

export type SubmitReturnWithErrors<TData extends FormDataBase> = Promise<{
  hasErrors: boolean;
  errors: ApiErrors<TData>;
}>;

export type SimpleSubmitFn<TData extends FormDataBase | {}> = keyof TData extends never
  ? () => SubmitReturnWithErrors<TData>
  : (formData: TData) => SubmitReturnWithErrors<TData>;

export type FormSubmitFn<TData extends FormDataBase> = (
  formData: TData,
  formHelpers: FormikHelpers<TData>
) => SubmitReturnWithErrors<TData>;
