import phoneNumber from "google-libphonenumber";
import { useCallback } from "react";

export const usePhoneNumberUtils = () => {
  const phoneNumberUtils = phoneNumber.PhoneNumberUtil.getInstance();

  const isValidNumber = useCallback(
    (phone: string) => {
      try {
        const parsedPhone = phoneNumberUtils.parseAndKeepRawInput(phone);
        return phoneNumberUtils.isValidNumber(parsedPhone);
      } catch (e) {
        return false;
      }
    },
    [phoneNumberUtils]
  );

  return { isValidNumber };
};
