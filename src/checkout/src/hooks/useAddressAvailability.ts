import { type CountryCode } from "@/checkout/src/graphql";
import { useAvailableShippingCountries } from "@/checkout/src/hooks/useAvailableShippingCountries";
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
