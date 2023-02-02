import { CheckoutUpdateStateScope } from "@/checkout-storefront/state/updateStateStore";
import { FormDataBase, FormHelpers } from "@/checkout-storefront/hooks/useForm";
import {
  MutationBaseFn,
  MutationData,
  MutationVars,
  ParserFunction,
  SubmitReturnWithErrors,
} from "@/checkout-storefront/hooks/useSubmit/types";
import { ApiErrors } from "@/checkout-storefront/hooks/useGetParsedErrors/types";
import { useSubmit, UseSubmitProps } from "@/checkout-storefront/hooks/useSubmit/useSubmit";

export type FormSubmitFn<TData extends FormDataBase> = (
  formData: TData,
  formHelpers: FormHelpers<TData>
) => SubmitReturnWithErrors<TData>;

interface CallbackProps<TData extends FormDataBase> {
  formHelpers: FormHelpers<TData>;
  formData: TData;
}

interface UseFormSubmitProps<
  TData extends FormDataBase,
  TMutationFn extends MutationBaseFn,
  TErrorCodes extends string = string
> {
  scope: CheckoutUpdateStateScope;
  onSubmit: (vars: MutationVars<TMutationFn>) => Promise<MutationData<TMutationFn>>;
  parse: ParserFunction<TData, TMutationFn>;
  onAbort?: (props: CallbackProps<TData>) => void;
  onSuccess?: (props: CallbackProps<TData> & { result: MutationData<TMutationFn> }) => void;
  onError?: (
    props: CallbackProps<TData> & {
      errors: ApiErrors<TData, TErrorCodes>;
    }
  ) => void;
  onStart?: (props: CallbackProps<TData>) => void;
  shouldAbort?:
    | ((props: CallbackProps<TData>) => Promise<boolean>)
    | ((props: CallbackProps<TData>) => boolean);
}

const useFormSubmit = <
  TData extends FormDataBase,
  TMutationFn extends MutationBaseFn,
  TErrorCodes extends string = string
>(
  props: UseFormSubmitProps<TData, TMutationFn, TErrorCodes>
): FormSubmitFn<TData> => {
  const handleSubmit: FormSubmitFn<TData> = useSubmit<TData, TMutationFn, TErrorCodes>(
    props as UseSubmitProps<TData, TMutationFn, TErrorCodes>
  );

  return handleSubmit;
};

export { useFormSubmit };
