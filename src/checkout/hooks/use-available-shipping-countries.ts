import { type CountryCode } from "@/checkout/graphql";
import { useCheckoutData } from "@/checkout/providers/checkout-data";

interface UseAvailableShippingCountries {
	availableShippingCountries: CountryCode[];
}

/** Channel countries — server-hydrated on the checkout page. */
export const useAvailableShippingCountries = (): UseAvailableShippingCountries => {
	const { shippingCountries } = useCheckoutData();
	return { availableShippingCountries: shippingCountries };
};
