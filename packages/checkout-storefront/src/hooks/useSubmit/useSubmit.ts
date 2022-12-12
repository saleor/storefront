import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { ApiErrors, useGetParsedApiErrors } from "@/checkout-storefront/hooks/useErrors";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { extractMutationErrors, localeToLanguageCode } from "@/checkout-storefront/lib/utils";
import {
  CheckoutUpdateStateScope,
  useCheckoutUpdateStateChange,
} from "@/checkout-storefront/state/updateStateStore";
import { FormikHelpers } from "formik";
import { useCallback } from "react";
import { OperationResult } from "urql";
import { debounce, DebouncedFunc } from "lodash-es";
import { FormDataBase } from "@/checkout-storefront/hooks/useForm";
import {
  CommonVars,
  FormSubmitFn,
  MutationData,
  MutationVars,
  SimpleSubmitFn,
} from "@/checkout-storefront/hooks/useSubmit/types";

interface UseSubmitProps<
  TData extends FormDataBase,
  TMutationFn extends (vars: any) => Promise<OperationResult<any, any>>
> {
  scope: CheckoutUpdateStateScope;
  onSubmit: (vars: MutationVars<TMutationFn>) => Promise<MutationData<TMutationFn>>;
  formDataParse: (data: TData & CommonVars) => MutationVars<TMutationFn>;
  shouldAbort?: ((formData: TData) => Promise<boolean>) | ((formData: TData) => boolean);
  onAbort?: (props: any) => void;
  onSuccess?: (props: any) => void;
  onError?: (props: any) => void;
  onEnter?: (props: any) => void;
}

interface UseSubmitCallbacks<
  TData extends FormDataBase,
  TMutationFn extends (vars: any) => Promise<OperationResult<any, any>>,
  TProps extends FormikHelpers<TData> | {} = {}
> {
  onAbort?: (props: { formData: TData } & TProps) => void;
  onSuccess?: (props: { formData: TData; result: MutationData<TMutationFn> } & TProps) => void;
  onError?: (props: { formData: TData; errors: ApiErrors<TData> } & TProps) => void;
  onEnter?: (props: { formData: TData } & TProps) => void;
}

function useSubmit<
  TData extends FormDataBase,
  TMutationFn extends (vars: any) => Promise<OperationResult<any, any>>
>(
  props: UseSubmitProps<TData, TMutationFn> & UseSubmitCallbacks<TData, TMutationFn>
): {
  debouncedSubmit: DebouncedFunc<SimpleSubmitFn<TData>>;
  onSubmit: SimpleSubmitFn<TData>;
};

function useSubmit<
  TData extends FormDataBase,
  TMutationFn extends (vars: any) => Promise<OperationResult<any, any>>
>(
  props: UseSubmitProps<TData, TMutationFn> &
    UseSubmitCallbacks<TData, TMutationFn, FormikHelpers<TData>>
): {
  debouncedSubmit: DebouncedFunc<FormSubmitFn<TData>>;
  onSubmit: FormSubmitFn<TData>;
};

function useSubmit<
  TData extends FormDataBase,
  TMutationFn extends (vars: any) => Promise<OperationResult<any, any>>
>({
  onSuccess,
  onError,
  onEnter,
  onSubmit,
  onAbort,
  scope,
  shouldAbort,
  formDataParse,
}: UseSubmitProps<TData, TMutationFn>) {
  const { setCheckoutUpdateState } = useCheckoutUpdateStateChange(scope);
  const { checkout } = useCheckout();
  const { showErrors } = useAlerts("checkoutDeliveryMethodUpdate");
  const { getFormErrorsFromApiErrors } = useGetParsedApiErrors<TData>();
  const localeData = useLocale();

  const handleSubmit = useCallback(
    async (formData: TData = {} as TData, formHelpers?: FormikHelpers<TData>) => {
      const { setErrors } = formHelpers || {};
      const callbackProps = { ...formHelpers, formData };

      if (typeof onEnter === "function") {
        onEnter(callbackProps);
      }

      const shouldAbortSubmit =
        typeof shouldAbort === "function" ? await shouldAbort(formData) : false;

      if (shouldAbortSubmit) {
        if (typeof onAbort === "function") {
          onAbort(callbackProps);
        }
        return { hasErrors: false, errors: [] };
      }

      const commonData: CommonVars = {
        languageCode: localeToLanguageCode(localeData.locale),
        channel: checkout.channel.slug,
        checkoutId: checkout.id,
      };

      const result = await onSubmit(formDataParse({ ...formData, ...commonData }));

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
      formDataParse,
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
}

export { useSubmit };
