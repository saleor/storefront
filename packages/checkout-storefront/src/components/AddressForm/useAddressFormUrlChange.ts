import { CountryCode } from "@/checkout-storefront/graphql";
import { UseFormReturn } from "@/checkout-storefront/hooks/useForm";
import { UrlChangeHandlerArgs, useUrlChange } from "@/checkout-storefront/hooks/useUrlChange";
import { getParsedLocaleData } from "@/checkout-storefront/lib/utils/locale";
import { omit } from "lodash-es";
import { useCallback } from "react";

export const useAddressFormUrlChange = (form: UseFormReturn<{ countryCode?: CountryCode }>) => {
  const { values, setFieldValue } = form;
  const { countryCode } = values;

  const hasFilledAnyData = Object.values(omit(values, ["id", "countryCode"])).some(
    (value) => !!value
  );

  const handleUrlChange = useCallback(
    ({ queryParams: { locale } }: UrlChangeHandlerArgs) => {
      if (hasFilledAnyData) {
        return;
      }

      const newCountryCode = getParsedLocaleData(locale).countryCode;

      const hasCountryChanged = newCountryCode !== countryCode;

      if (hasCountryChanged) {
        void setFieldValue("countryCode", newCountryCode);
      }
    },
    [countryCode, hasFilledAnyData, setFieldValue]
  );

  useUrlChange(handleUrlChange);
};
