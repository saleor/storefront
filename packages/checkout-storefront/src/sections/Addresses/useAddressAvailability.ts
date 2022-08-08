import { CountryCode, useChannelQuery } from "@/checkout-storefront/graphql";

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

  const availableShippingCountries: CountryCode[] =
    (data?.channel?.countries?.map(({ code }) => code) as CountryCode[]) || [];

  const isAvailable = ({ country }: { country: { code: string } }) => {
    if (pause) {
      return true;
    }

    return availableShippingCountries.includes(country?.code as CountryCode);
  };

  return { isAvailable };
};
