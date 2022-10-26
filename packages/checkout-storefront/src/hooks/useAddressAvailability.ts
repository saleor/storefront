import { CountryCode } from "@/checkout-storefront/graphql";
import { useAvailableShippingCountries } from "@/checkout-storefront/hooks/useAvailableShippingCountries";
import { useCallback } from "react";

export const useAddressAvailability = (skipCheck = false) => {
  const { availableShippingCountries } = useAvailableShippingCountries();

  const isAvailable = useCallback(
    ({ country }: { country: { code: string } }) => {
      if (skipCheck) {
        return true;
      }

      return availableShippingCountries.includes(country?.code as CountryCode);
    },
    [skipCheck, availableShippingCountries]
  );

  return { isAvailable, availableShippingCountries };
};
