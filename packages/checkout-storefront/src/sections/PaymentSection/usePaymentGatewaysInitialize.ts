import { CountryCode, usePaymentGatewaysInitializeMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { UrlChangeHandlerArgs, useUrlChange } from "@/checkout-storefront/hooks/useUrlChange";
import { MightNotExist } from "@/checkout-storefront/lib/globalTypes";
import { Locale } from "@/checkout-storefront/lib/regions";
import { ParsedPaymentGateways } from "@/checkout-storefront/sections/PaymentSection/types";
import {
  getFilteredPaymentGateways,
  getParsedPaymentGatewayConfigs,
} from "@/checkout-storefront/sections/PaymentSection/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const usePaymentGatewaysInitialize = () => {
  const { locale } = useLocale();
  const {
    checkout: { billingAddress },
  } = useCheckout();
  const {
    checkout: { id: checkoutId, availablePaymentGateways },
  } = useCheckout();

  const billingCountry = billingAddress?.country.code as MightNotExist<CountryCode>;

  const [gatewayConfigs, setGatewayConfigs] = useState<ParsedPaymentGateways>({});
  const previousLocale = useRef<Locale>(locale);
  const previousBillingCountry = useRef(billingCountry);

  const [{ fetching }, paymentGatewaysInitialize] = usePaymentGatewaysInitializeMutation();

  const onSubmit = useSubmit<{}, typeof paymentGatewaysInitialize>(
    useMemo(
      () => ({
        hideAlerts: true,
        scope: "paymentGatewaysInitialize",
        shouldAbort: () => !availablePaymentGateways.length,
        onSubmit: paymentGatewaysInitialize,
        parse: () => ({
          checkoutId,
          paymentGateways: getFilteredPaymentGateways(availablePaymentGateways).map(
            ({ config, id }) => ({
              id,
              data: config,
            })
          ),
        }),
        onSuccess: ({ data }) => {
          const parsedConfigs = getParsedPaymentGatewayConfigs(data.gatewayConfigs);

          if (!Object.keys(parsedConfigs).length) {
            throw new Error("No available payment gateways");
          }

          setGatewayConfigs(parsedConfigs);
        },
        onError: ({ errors }) => {
          console.log({ errors });
        },
      }),
      [availablePaymentGateways, checkoutId, paymentGatewaysInitialize]
    )
  );

  useEffect(() => {
    void onSubmit();
  }, []);

  const handleLocaleChange = useCallback(
    ({ queryParams: { locale: locale } }: UrlChangeHandlerArgs) => {
      const hasLocaleChanged = locale !== previousLocale.current;

      if (hasLocaleChanged) {
        previousLocale.current = locale;

        void onSubmit();
      }
    },
    [onSubmit]
  );

  useUrlChange(handleLocaleChange);

  useEffect(() => {
    if (billingCountry !== previousBillingCountry.current) {
      previousBillingCountry.current = billingCountry;
      void onSubmit();
    }
  }, [billingCountry, onSubmit]);

  return {
    fetching,
    availablePaymentGateways: gatewayConfigs || [],
  };
};
