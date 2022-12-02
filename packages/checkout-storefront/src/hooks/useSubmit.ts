import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { FormDataBase } from "@/checkout-storefront/lib/globalTypes";
import { extractMutationErrors, localeToLanguageCode } from "@/checkout-storefront/lib/utils";
import {
  CheckoutUpdateStateScope,
  useCheckoutUpdateStateChange,
} from "@/checkout-storefront/state/updateStateStore";
import { useCallback } from "react";
import { OperationResult } from "urql";

export type MutationVars<MutationFn> = MutationFn extends (vars: infer Vars) => any ? Vars : never;
export type MutationData<MutationFn> = MutationFn extends (vars: any) => infer Data ? Data : never;

const commonVars = ["locale", "channel", "checkoutId"] as const;
type CommonVar = typeof commonVars[number];

// want to pass only FormData
// but we also need MutationVariables, MutationResult, Errors

interface UseSubmitProps<TData extends FormDataBase> {
  scope: CheckoutUpdateStateScope;
  onSubmit: (vars: MutationVars<TMutation>) => Promise<MutationData<TMutation>>;
  formDataParse?: (formData: TData) => Omit<MutationVars<TMutation>, CommonVar>;
  submitDataOpts?: CommonVar[];
  shouldAbort?: (formData: TData) => boolean;
  onAbort?: (FormData: TData) => void;
  onSuccess?: (formData: TData) => void;
  onError?: (formData: TData, errors: ApiErrors<>) => void;
}

export const useSubmit = <TData extends FormDataBase>({
  onSuccess,
  onError,
  scope,
  shouldAbort,
  onSubmit,
  onAbort,
  formDataParse,
  submitDataOpts = [],
}: UseSubmitProps<TData>) => {
  const { setCheckoutUpdateState } = useCheckoutUpdateStateChange(scope);
  const { checkout } = useCheckout();
  const { showErrors } = useAlerts("checkoutDeliveryMethodUpdate");
  const localeData = useLocale();

  const getMutationData = useCallback(
    (formData: TData) => {
      const shouldParse = typeof formDataParse === "function";
      const locale = localeToLanguageCode(localeData.locale);

      const submitData = shouldParse ? formDataParse(formData) : formData;

      const dataMap: Record<CommonVar, string> = {
        locale,
        channel: checkout.channel.slug,
        checkoutId: checkout.id,
      };

      return submitDataOpts.reduce(
        (result, varName) => ({
          ...result,
          [varName]: dataMap[varName],
        }),
        submitData
      ) as MutationData;
    },
    [checkout.id, formDataParse, localeData.locale, submitDataOpts]
  );

  const handleSubmit = useCallback(
    async (formData: TData) => {
      if (typeof shouldAbort === "function" && shouldAbort(formData)) {
        if (typeof onAbort === "function") {
          onAbort(formData);
        }
        return;
      }

      const result = await onSubmit(getMutationData(formData) as TMutationVars);

      const [hasErrors, errors] = extractMutationErrors(result);

      if (!hasErrors) {
        typeof onSuccess === "function" && onSuccess(formData);
        setCheckoutUpdateState("success");
        return;
      }

      typeof onError === "function" && onError(formData, errors);
      setCheckoutUpdateState("error");
      showErrors(errors);
    },
    [getMutationData, onError, onSubmit, onSuccess, setCheckoutUpdateState, shouldAbort, showErrors]
  );

  return handleSubmit;
};
