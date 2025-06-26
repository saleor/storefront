import { useEffect } from "react";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useCheckoutShippingAddressUpdateMutation } from "@/checkout/graphql";
import { getAddressInputData } from "@/checkout/components/AddressForm/utils";

/**
 * Hook to pre-load shipping methods with default US address
 * This helps show shipping options earlier in the checkout process
 */
export const usePreloadShippingMethods = () => {
	const { checkout } = useCheckout();
	const { shippingAddress, shippingMethods } = checkout;
	const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();

	useEffect(() => {
		// Only pre-load if:
		// 1. No shipping address is set yet
		// 2. No shipping methods are available yet
		// 3. Shipping is required for this checkout
		if (!shippingAddress && !shippingMethods?.length && checkout?.isShippingRequired) {
			// Set a minimal US address to trigger shipping method calculation
			const defaultUSAddress = getAddressInputData({
				countryCode: "US",
				// Minimal required fields for shipping calculation
				firstName: "",
				lastName: "",
				streetAddress1: "",
				city: "",
				postalCode: "",
			});

			// Update shipping address with default US to get shipping methods
			checkoutShippingAddressUpdate({
				checkoutId: checkout.id,
				languageCode: "EN_US",
				shippingAddress: defaultUSAddress,
				validationRules: {
					checkRequiredFields: false, // Don't validate required fields for pre-loading
				},
			}).catch((error) => {
				// Silently handle errors for pre-loading
				console.debug("Pre-loading shipping methods failed:", error);
			});
		}
	}, [shippingAddress, shippingMethods, checkout, checkoutShippingAddressUpdate]);

	return {
		isPreloading: !shippingAddress && !shippingMethods?.length && checkout?.isShippingRequired,
		hasShippingMethods: (shippingMethods?.length || 0) > 0,
	};
};
