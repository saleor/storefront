import { getParsedLocaleData } from "@/checkout-storefront/lib/utils";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { DefaultValues, Resolver, useForm, UseFormReturn } from "react-hook-form";
import { AddressFormData } from "./types";
import { emptyFormData, isMatchingAddressFormData } from "@/checkout-storefront/lib/utils";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { CountryCode } from "@/checkout-storefront/graphql";
import { countries } from "@/checkout-storefront/lib/consts/countries";
import { UrlChangeHandlerArgs, useUrlChange } from "@/checkout-storefront/hooks/useUrlChange";
import { omit } from "lodash-es";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";
import { useAddressFormValidationResolver } from "@/checkout-storefront/components/AddressForm/useAddressFormValidationResolver";
import { getPhoneNumberWithCountryCode } from "@/checkout-storefront/lib/utils/phoneNumber";

export interface UseAddressFormProps {
  defaultValues?: AddressFormData;
  onSubmit: (formData: AddressFormData) => void;
}

export interface UseAddressFormReturn {
  formProps: UseFormReturn<AddressFormData>;
  onSubmit: (formData: AddressFormData) => void;
}

export const useAddressForm = ({
  defaultValues = emptyFormData,
  onSubmit,
}: UseAddressFormProps): UseAddressFormReturn => {
  const defaultValuesRef = useRef<AddressFormData>(defaultValues);

  const initialCountryCode = useMemo(() => {
    const countryCodeInOptions = countries.find((code) => code === defaultValues.countryCode);

    return (
      (countryCodeInOptions as CountryCode) ||
      getParsedLocaleData(getQueryParams().locale).countryCode
    );
  }, [defaultValues]);

  const resolver = useAddressFormValidationResolver();

  const formProps = useForm<AddressFormData>({
    resolver: resolver as unknown as Resolver<AddressFormData, any>,
    mode: "onChange",
    defaultValues: {
      ...(defaultValues as DefaultValues<AddressFormData>),
      countryCode: initialCountryCode,
    },
  });

  const { trigger, getValues, setValue } = formProps;

  useCheckoutFormValidationTrigger(trigger);

  const hasDataChanged = useCallback(
    (formData: AddressFormData) => !isMatchingAddressFormData(formData, defaultValuesRef.current),
    []
  );

  const handleOnSubmit = useCallback(
    (formData: AddressFormData) => {
      if (hasDataChanged(formData)) {
        onSubmit({
          ...formData,
          phone: getPhoneNumberWithCountryCode(formData.phone, formData.countryCode),
        });
        return;
      }
    },
    [hasDataChanged, onSubmit]
  );

  const handleUrlChange = useCallback(
    ({ queryParams: { locale } }: UrlChangeHandlerArgs) => {
      const formData = getValues();
      const newCountryCode = getParsedLocaleData(locale).countryCode;

      const hasCountryChanged = newCountryCode !== formData.countryCode;

      const hasFilledAnyData = Object.values(omit(formData, ["id", "countryCode"])).some(
        (value) => !!value
      );

      if (hasCountryChanged && !hasFilledAnyData) {
        setValue("countryCode", newCountryCode);
      }
    },
    [getValues, setValue]
  );

  useUrlChange(handleUrlChange);

  useEffect(() => {
    if (!hasDataChanged(defaultValues)) {
      return;
    }

    defaultValuesRef.current = defaultValues;
  }, [defaultValues, hasDataChanged, trigger]);

  return { formProps, onSubmit: handleOnSubmit };
};
