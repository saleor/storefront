import { Exact, LanguageCodeEnum } from "@/checkout-storefront/graphql";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { ApiErrors } from "@/checkout-storefront/hooks/useErrors";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { FormDataBase } from "@/checkout-storefront/lib/globalTypes";
import { extractMutationErrors, localeToLanguageCode } from "@/checkout-storefront/lib/utils";
import {
  CheckoutUpdateStateScope,
  useCheckoutUpdateStateChange,
} from "@/checkout-storefront/state/updateStateStore";
import { useCallback } from "react";
import { OperationResult } from "urql";

type MutationVars<MutationFn> = MutationFn extends (vars: Exact<infer Vars>) => any ? Vars : never;
type MutationData<MutationFn> = MutationFn extends (vars: any) => infer Data ? Data : never;

const commonVars = ["languageCode", "channel", "checkoutId"] as const;
type CommonVar = typeof commonVars[number];

type CommonVars = Record<CommonVar, string> & { languageCode: LanguageCodeEnum };

interface UseSubmitProps<
  TData extends FormDataBase,
  TMutationFn extends (vars: any) => Promise<OperationResult<any, any>>
> {
  scope: CheckoutUpdateStateScope;
  onSubmit: (vars: MutationVars<TMutationFn>) => MutationData<TMutationFn>;
  formDataParse: (formData: TData, commonData: CommonVars) => MutationVars<TMutationFn>;
  shouldAbort?: (formData: TData) => boolean;
  onAbort?: (FormData: TData) => void;
  onSuccess?: (formData: TData) => void;
  onError?: (formData: TData, errors: ApiErrors<TData>) => void;
}

export const useSubmit = <
  TData extends FormDataBase,
  TMutationFn extends (vars: any) => Promise<OperationResult<any, any>>
>({
  onSuccess,
  onError,
  scope,
  shouldAbort,
  onSubmit,
  onAbort,
  formDataParse,
}: UseSubmitProps<TData, TMutationFn>) => {
  const { setCheckoutUpdateState } = useCheckoutUpdateStateChange(scope);
  const { checkout } = useCheckout();
  const { showErrors } = useAlerts("checkoutDeliveryMethodUpdate");
  const localeData = useLocale();

  const handleSubmit = useCallback(
    async (formData: TData) => {
      if (typeof shouldAbort === "function" && shouldAbort(formData)) {
        if (typeof onAbort === "function") {
          onAbort(formData);
        }
        return;
      }

      const commonData: CommonVars = {
        languageCode: localeToLanguageCode(localeData.locale),
        channel: checkout.channel.slug,
        checkoutId: checkout.id,
      };

      const result = await onSubmit(formDataParse(formData, commonData));

      const [hasErrors, errors] = extractMutationErrors<TData>(result);

      if (!hasErrors) {
        typeof onSuccess === "function" && onSuccess(formData);
        setCheckoutUpdateState("success");
        return;
      }

      typeof onError === "function" && onError(formData, errors);
      setCheckoutUpdateState("error");
      showErrors(errors);
    },
    [
      checkout.channel.slug,
      checkout.id,
      formDataParse,
      localeData.locale,
      onAbort,
      onError,
      onSubmit,
      onSuccess,
      setCheckoutUpdateState,
      shouldAbort,
      showErrors,
    ]
  );

  return handleSubmit;
};
