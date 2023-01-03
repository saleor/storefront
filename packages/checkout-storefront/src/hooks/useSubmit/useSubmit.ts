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

interface UseSubmitProps<TData extends FormDataBase, TMutationFn extends MutationBaseFn> {
  scope: CheckoutUpdateStateScope;
  onSubmit: (vars: MutationVars<TMutationFn>) => Promise<MutationData<TMutationFn>>;
  parse: ParserFunction<TData, TMutationFn>;
  onAbort?: (props: { formData: TData }) => void;
  onSuccess?: (props: { formData: TData; result: MutationData<TMutationFn> }) => void;
  onError?: (props: { formData: TData; errors: ApiErrors<TData> }) => void;
  onEnter?: (props: { formData: TData }) => void;
  shouldAbort?:
    | ((props: { formData: TData }) => Promise<boolean>)
    | ((props: { formData: TData }) => boolean);
}

export const useSubmit = <TData extends FormDataBase, TMutationFn extends MutationBaseFn>({
  onSuccess,
  onError,
  onEnter,
  onSubmit,
  onAbort,
  scope,
  shouldAbort,
  parse,
}: UseSubmitProps<TData, TMutationFn>): SimpleSubmitFn<TData> => {
  const { setCheckoutUpdateState } = useCheckoutUpdateStateChange(scope);
  const { checkout } = useCheckout();
  const { showErrors } = useAlerts("checkoutDeliveryMethodUpdate");
  const localeData = useLocale();

  const handleSubmit = useCallback(
    async (formData: TData = {} as TData) => {
      const callbackProps = { formData };

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

      return { hasErrors, errors };
    },
    [
      checkout.channel.slug,
      checkout.id,
      // parse,
      localeData.locale,
      onAbort,
      onEnter,
      onError,
      onSubmit,
      onSuccess,
      setCheckoutUpdateState,
      // shouldAbort,
      showErrors,
    ]
  );

  return handleSubmit;
};
