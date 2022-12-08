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
type MutationData<MutationFn> = MutationFn extends (vars: any) => Promise<infer Data>
  ? Data
  : never;

const commonVars = ["languageCode", "channel", "checkoutId"] as const;
type CommonVar = typeof commonVars[number];

type CommonVars = Record<CommonVar, string> & { languageCode: LanguageCodeEnum };

export type SubmitReturnWithErrors<TData extends FormDataBase> = Promise<{
  hasErrors: boolean;
  errors: ApiErrors<TData>;
}>;

interface UseSubmitProps<
  TData extends FormDataBase,
  TMutationFn extends (vars: any) => Promise<OperationResult<any, any>>
> {
  scope: CheckoutUpdateStateScope;
  onSubmit: (vars: MutationVars<TMutationFn>) => Promise<MutationData<TMutationFn>>;
  formDataParse: (data: TData & CommonVars) => MutationVars<TMutationFn>;
  shouldAbort?: ((formData: TData) => Promise<boolean>) | ((formData: TData) => boolean);
  onAbort?: (FormData: TData) => void;
  onSuccess?: (formData: TData, result: MutationData<TMutationFn>) => void;
  onError?: (errors: ApiErrors<TData>, formData: TData) => void;
  onEnter?: (formData: TData) => void;
}

type SubmitFn<TData extends FormDataBase> = (formData: TData) => SubmitReturnWithErrors<TData>;

export const useSubmit = <
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
}: UseSubmitProps<TData, TMutationFn>): SubmitFn<TData> => {
  const { setCheckoutUpdateState } = useCheckoutUpdateStateChange(scope);
  const { checkout } = useCheckout();
  const { showErrors } = useAlerts("checkoutDeliveryMethodUpdate");
  const localeData = useLocale();

  const handleSubmit = useCallback(
    async (formData: TData = {} as TData) => {
      if (typeof onEnter === "function") {
        onEnter(formData);
      }

      const shouldAbortSubmit =
        typeof shouldAbort === "function" ? await shouldAbort(formData) : false;

      if (shouldAbortSubmit) {
        if (typeof onAbort === "function") {
          onAbort(formData);
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
        typeof onSuccess === "function" && onSuccess(formData, result);
        setCheckoutUpdateState("success");
        return { hasErrors, errors };
      }

      typeof onError === "function" && onError(errors, formData);
      setCheckoutUpdateState("error");
      showErrors(errors);
      return { hasErrors, errors };
    },
    [
      checkout.channel.slug,
      checkout.id,
      formDataParse,
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

  return handleSubmit;
};
