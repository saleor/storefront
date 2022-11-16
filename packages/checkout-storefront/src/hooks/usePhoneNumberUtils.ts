import { CountryCode } from "@/checkout-storefront/graphql";

import {
  parsePhoneNumberWithError,
  CountryCode as PhoneNumberLibCountryCode,
  PhoneNumber,
} from "libphonenumber-js/max";
import { useCallback } from "react";

export const usePhoneNumberUtils = () => {
  const getPhoneNumberInstance = useCallback(
    (phone: string, countryCode: CountryCode | undefined): PhoneNumber | null => {
      try {
        const phoneNumber = parsePhoneNumberWithError(
          phone,
          countryCode as PhoneNumberLibCountryCode
        );
        return phoneNumber;
      } catch (error) {
        return null;
      }
    },
    []
  );

  const isValidNumber = useCallback(
    (phone: string, countryCode: CountryCode | undefined) =>
      !!getPhoneNumberInstance(phone, countryCode)?.isValid(),
    [getPhoneNumberInstance]
  );

  const isMissingCountryCallingCode = useCallback(
    (phone: string, countryCode: CountryCode) => {
      const isValidWithoutCountryCode = getPhoneNumberInstance(phone, undefined);
      const isValidWithCountryCode = isValidNumber(phone, countryCode);

      return isValidWithCountryCode && !isValidWithoutCountryCode;
    },
    [getPhoneNumberInstance, isValidNumber]
  );

  const getPhoneNumberWithCountryCode = useCallback(
    (phone: string, countryCode: CountryCode) => {
      if (isMissingCountryCallingCode(phone, countryCode)) {
        const callingCode = getPhoneNumberInstance(phone, countryCode)
          ?.countryCallingCode as string;

        return `+${callingCode}${phone}`;
      }

      return phone;
    },
    [getPhoneNumberInstance, isMissingCountryCallingCode]
  );

  return { isValidNumber, getPhoneNumberWithCountryCode };
};
