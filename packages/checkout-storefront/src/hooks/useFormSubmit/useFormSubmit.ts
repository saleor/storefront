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
import { useSubmit, UseSubmitProps } from "@/checkout-storefront/hooks/useSubmit";

export type FormSubmitFn<TData extends FormDataBase> = (
  formData: TData,
  formHelpers: FormHelpers<TData>
) => SubmitReturnWithErrors<TData>;

interface CallbackProps<TData extends FormDataBase> {
  formHelpers: FormHelpers<TData>;
  formData: TData;
}

interface UseFormSubmitProps<TData extends FormDataBase, TMutationFn extends MutationBaseFn> {
  scope: CheckoutUpdateStateScope;
  onSubmit: (vars: MutationVars<TMutationFn>) => Promise<MutationData<TMutationFn>>;
  parse: ParserFunction<TData, TMutationFn>;
  onAbort?: (props: CallbackProps<TData>) => void;
  onSuccess?: (props: CallbackProps<TData> & { result: MutationData<TMutationFn> }) => void;
  onError?: (
    props: CallbackProps<TData> & {
      errors: ApiErrors<TData>;
    }
  ) => void;
  onStart?: (props: CallbackProps<TData>) => void;
  shouldAbort?:
    | ((props: CallbackProps<TData>) => Promise<boolean>)
    | ((props: CallbackProps<TData>) => boolean);
}

const useFormSubmit = <TData extends FormDataBase, TMutationFn extends MutationBaseFn>(
  props: UseFormSubmitProps<TData, TMutationFn>
): FormSubmitFn<TData> => {
  const handleSubmit: FormSubmitFn<TData> = useSubmit<TData, TMutationFn>(
    props as UseSubmitProps<TData, TMutationFn>
  );

  return handleSubmit;
};

export { useFormSubmit };
