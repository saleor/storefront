import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { useMemo } from "react";
import { object, string } from "yup";

export const useAddressFormSchema = () => {
  const { errorMessages } = useErrorMessages();

  return useMemo(
    () =>
      object({
        firstName: string().required(errorMessages.required),
        lastName: string().required(errorMessages.required),
        streetAddress1: string().required(errorMessages.required),
        streetAddress2: string(),
        companyName: string(),
        city: string().required(errorMessages.required),
        cityArea: string(),
        countryArea: string(),
        phone: string(),
        postalCode: string().required(errorMessages.required),
        countryCode: string(),
      }),
    [errorMessages]
  );
};
