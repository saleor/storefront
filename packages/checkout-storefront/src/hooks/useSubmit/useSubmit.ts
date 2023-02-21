import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import {
  CheckoutUpdateStateScope,
  useCheckoutUpdateStateChange,
} from "@/checkout-storefront/state/updateStateStore";
import { useCallback } from "react";
import { FormDataBase } from "@/checkout-storefront/hooks/useForm";
import {
  CommonVars,
  MutationBaseFn,
  MutationData,
  MutationVars,
  ParserFunction,
  SimpleSubmitFn,
} from "@/checkout-storefront/hooks/useSubmit/types";
import { ApiErrors } from "@/checkout-storefront/hooks/useGetParsedErrors/types";
import { extractMutationErrors } from "@/checkout-storefront/lib/utils/common";
import { localeToLanguageCode } from "@/checkout-storefront/lib/utils/locale";

interface CallbackProps<TData> {
  formData: TData;
  formHelpers?: any;
}

export interface UseSubmitProps<
  TData extends FormDataBase,
  TMutationFn extends MutationBaseFn,
  TErrorCodes extends string = string
> {
  hideAlerts?: boolean;
  scope: CheckoutUpdateStateScope;
  onSubmit: (vars: MutationVars<TMutationFn>) => Promise<MutationData<TMutationFn>>;
  parse: ParserFunction<TData, TMutationFn>;
  onAbort?: (props: CallbackProps<TData>) => void;
  onSuccess?: (props: CallbackProps<TData> & { result: MutationData<TMutationFn> }) => void;
  onError?: (props: CallbackProps<TData> & { errors: ApiErrors<TData, TErrorCodes> }) => void;
  onStart?: (props: CallbackProps<TData>) => void;
  shouldAbort?:
    | ((props: CallbackProps<TData>) => Promise<boolean>)
    | ((props: CallbackProps<TData>) => boolean);
}

export const useSubmit = <
  TData extends FormDataBase,
  TMutationFn extends MutationBaseFn,
  TErrorCodes extends string = string
>({
  onSuccess,
  onError,
  onStart,
  onSubmit,
  onAbort,
  scope,
  shouldAbort,
  parse,
  hideAlerts = false,
}: UseSubmitProps<TData, TMutationFn, TErrorCodes>): SimpleSubmitFn<TData> => {
  const { setCheckoutUpdateState } = useCheckoutUpdateStateChange(scope);
  const { showErrors } = useAlerts(scope);
  const { checkout } = useCheckout();
  const localeData = useLocale();

  const handleSubmit = useCallback(
    async (formData: TData = {} as TData, formHelpers?: any) => {
      const callbackProps: CallbackProps<TData> = { formData, formHelpers };

      if (typeof onStart === "function") {
        onStart(callbackProps);
      }

      const shouldAbortSubmit =
        typeof shouldAbort === "function" ? await shouldAbort(callbackProps) : false;

      if (shouldAbortSubmit) {
        if (typeof onAbort === "function") {
          setCheckoutUpdateState("success");
          onAbort(callbackProps);
        }
        return { hasErrors: false, errors: [] };
      }

      const commonData: CommonVars = {
        languageCode: localeToLanguageCode(localeData.locale),
        channel: checkout.channel.slug,
        checkoutId: checkout.id,
      };

      const result = await onSubmit(parse({ ...formData, ...commonData }));

      const [hasErrors, errors] = extractMutationErrors<TData, TErrorCodes>(result);

      if (!hasErrors) {
        typeof onSuccess === "function" && onSuccess({ ...callbackProps, result });
        setCheckoutUpdateState("success");

        return { hasErrors, errors };
      }

      typeof onError === "function" && onError({ ...callbackProps, errors });
      setCheckoutUpdateState("error");
      if (!hideAlerts) {
        showErrors(errors);
      }

      return { hasErrors, errors };
    },
    [
      onStart,
      shouldAbort,
      localeData.locale,
      checkout.channel.slug,
      checkout.id,
      onSubmit,
      parse,
      onError,
      setCheckoutUpdateState,
      hideAlerts,
      onAbort,
      onSuccess,
      showErrors,
    ]
  );

  return handleSubmit;
};
