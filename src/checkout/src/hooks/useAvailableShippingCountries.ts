import { useMemo } from "react";
import { type CountryCode, useChannelQuery } from "@/checkout/src/graphql";
import { useCheckout } from "@/checkout/src/hooks/useCheckout";

interface UseAvailableShippingCountries {
	availableShippingCountries: CountryCode[];
}

export const useAvailableShippingCountries = (): UseAvailableShippingCountries => {
	const { checkout } = useCheckout();
	const [{ data }] = useChannelQuery({
		variables: { slug: checkout.channel.slug },
		pause: !checkout?.channel.slug,
	});

	const availableShippingCountries: CountryCode[] = useMemo(
		() => (data?.channel?.countries?.map(({ code }) => code) as CountryCode[]) || [],
		[data?.channel?.countries],
	);

	return { availableShippingCountries };
};
