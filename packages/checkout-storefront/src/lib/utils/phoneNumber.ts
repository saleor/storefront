import { CountryCode } from "@/checkout-storefront/graphql";

import {
  parsePhoneNumberWithError,
  CountryCode as PhoneNumberLibCountryCode,
  PhoneNumber,
} from "libphonenumber-js/max";

const getPhoneNumberInstance = (
  phone: string,
  countryCode: CountryCode | undefined
): PhoneNumber | null => {
  try {
    const phoneNumber = parsePhoneNumberWithError(phone, countryCode as PhoneNumberLibCountryCode);
    return phoneNumber;
  } catch (error) {
    return null;
  }
};

export const isValidPhoneNumber = (phone: string, countryCode: CountryCode | undefined) =>
  !!getPhoneNumberInstance(phone, countryCode)?.isValid();

const isMissingCountryCallingCode = (phone: string, countryCode: CountryCode) => {
  const isValidWithoutCountryCode = isValidPhoneNumber(phone, undefined);
  const isValidWithCountryCode = isValidPhoneNumber(phone, countryCode);

  return isValidWithCountryCode && !isValidWithoutCountryCode;
};

export const getPhoneNumberWithCountryCode = (phone: string, countryCode: CountryCode) => {
  if (isMissingCountryCallingCode(phone, countryCode)) {
    const callingCode = getPhoneNumberInstance(phone, countryCode)?.countryCallingCode as string;

    return `+${callingCode}${phone}`;
  }

  return phone;
};
