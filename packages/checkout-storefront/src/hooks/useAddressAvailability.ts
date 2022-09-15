import { CountryCode, useChannelQuery } from "@/checkout-storefront/graphql";
import { useCallback, useMemo } from "react";

interface UseAddressAvailabilityProps {
  pause: boolean;
}

export const useAddressAvailability = (
  { pause }: UseAddressAvailabilityProps = { pause: false }
) => {
  const [{ data }] = useChannelQuery({
    variables: { slug: "default-channel" },
    pause,
  });

  const availableShippingCountries: CountryCode[] = useMemo(
    () => (data?.channel?.countries?.map(({ code }) => code) as CountryCode[]) || [],
    [data?.channel]
  );

  const isAvailable = useCallback(
    ({ country }: { country: { code: string } }) => {
      if (pause) {
        return true;
      }

      return availableShippingCountries.includes(country?.code as CountryCode);
    },
    [pause, availableShippingCountries]
  );

  return { isAvailable };
};
