import { useCheckoutData } from "@/checkout/providers/checkout-data";
import type { ShippingCountryOption } from "@/checkout/lib/checkout-types";

interface UseAvailableShippingCountries {
	availableShippingCountries: ShippingCountryOption[];
}

/** Channel countries — server-hydrated on the checkout page. */
export const useAvailableShippingCountries = (): UseAvailableShippingCountries => {
	const { shippingCountries } = useCheckoutData();
	return { availableShippingCountries: shippingCountries };
};
