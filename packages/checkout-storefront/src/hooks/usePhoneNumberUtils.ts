import { CountryCode } from "@/checkout-storefront/graphql";

import {
  parsePhoneNumberWithError,
  CountryCode as PhoneNumberLibCountryCode,
} from "libphonenumber-js/max";

export const usePhoneNumberUtils = () => {
  const isValidNumber = (phone: string, countryCode?: CountryCode) => {
    try {
      const phoneNumber = parsePhoneNumberWithError(
        phone,
        countryCode as PhoneNumberLibCountryCode
      );
      return phoneNumber.isValid();
    } catch (error) {
      return false;
    }
  };

  return { isValidNumber };
};
