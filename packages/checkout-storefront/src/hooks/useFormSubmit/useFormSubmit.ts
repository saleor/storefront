import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import {
  CheckoutUpdateStateScope,
  useCheckoutUpdateStateChange,
} from "@/checkout-storefront/state/updateStateStore";
import { FormikHelpers } from "formik";
import { useCallback } from "react";
import { debounce, DebouncedFunc } from "lodash-es";
import { FormDataBase, FormHelpers } from "@/checkout-storefront/hooks/useForm";
import {
  CommonVars,
  MutationBaseFn,
  MutationData,
  MutationVars,
  ParserFunction,
} from "@/checkout-storefront/hooks/useSubmit/types";
import { ApiErrors } from "@/checkout-storefront/hooks/useGetParsedErrors/types";
import { useGetParsedErrors } from "@/checkout-storefront/hooks/useGetParsedErrors";
import { extractMutationErrors } from "@/checkout-storefront/lib/utils/common";
import { localeToLanguageCode } from "@/checkout-storefront/lib/utils/locale";
import { FormSubmitFn } from "@/checkout-storefront/hooks/useFormSubmit/types";

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
  onEnter?: (props: CallbackProps<TData>) => void;
  shouldAbort?:
    | ((props: CallbackProps<TData>) => Promise<boolean>)
    | ((props: CallbackProps<TData>) => boolean);
}

interface UseFormSubmitReturn<TData extends FormDataBase> {
  debouncedSubmit: DebouncedFunc<FormSubmitFn<TData>>;
  onSubmit: FormSubmitFn<TData>;
}

const useFormSubmit = <TData extends FormDataBase, TMutationFn extends MutationBaseFn>({
  onSuccess,
  onError,
  onEnter,
  onSubmit,
  onAbort,
  scope,
  shouldAbort,
  parse,
}: UseFormSubmitProps<TData, TMutationFn>): UseFormSubmitReturn<TData> => {
  const { setCheckoutUpdateState } = useCheckoutUpdateStateChange(scope);
  const { checkout } = useCheckout();
  const { showErrors } = useAlerts("checkoutDeliveryMethodUpdate");
  const { getFormErrorsFromApiErrors } = useGetParsedErrors<TData>();
  const localeData = useLocale();

  const handleSubmit = useCallback(
    async (formData: TData = {} as TData, formHelpers: FormikHelpers<TData>) => {
      const { setErrors, setSubmitting } = formHelpers || {};
      const callbackProps = { formHelpers, formData };

      if (typeof onEnter === "function") {
        onEnter(callbackProps);
      }

      const shouldAbortSubmit =
        typeof shouldAbort === "function" ? await shouldAbort(callbackProps) : false;

      if (shouldAbortSubmit) {
        if (typeof onAbort === "function") {
          onAbort(callbackProps);
        }
        return { hasErrors: false, errors: [] };
      }

      if (typeof setSubmitting === "function") {
        console.log("SETTINNNN");
        setSubmitting(true);
      }

      const commonData: CommonVars = {
        languageCode: localeToLanguageCode(localeData.locale),
        channel: checkout.channel.slug,
        checkoutId: checkout.id,
      };

      const result = await onSubmit(parse({ ...formData, ...commonData }));

      const [hasErrors, errors] = extractMutationErrors<TData>(result);

      if (!hasErrors) {
        typeof onSuccess === "function" && onSuccess({ ...callbackProps, result });
        setCheckoutUpdateState("success");

        return { hasErrors, errors };
      }

      typeof onError === "function" && onError({ ...callbackProps, errors });
      setCheckoutUpdateState("error");
      showErrors(errors);
      if (typeof setErrors === "function") {
        setErrors(getFormErrorsFromApiErrors(errors));
      }

      return { hasErrors, errors };
    },
    [
      checkout.channel.slug,
      checkout.id,
      parse,
      getFormErrorsFromApiErrors,
      localeData.locale,
      onAbort,
      onEnter,
      onError,
      onSubmit,
      onSuccess,
      setCheckoutUpdateState,
      shouldAbort,
      showErrors,
    ]
  );

  // because eslint is unable to read deps inside of debounce
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSubmit = useCallback(
    debounce(
      (formData: TData, formHelpers?: FormikHelpers<TData>) => handleSubmit(formData, formHelpers),
      2000
    ),
    [onSubmit]
  );

  return { onSubmit: handleSubmit, debouncedSubmit };
};

export { useFormSubmit };
