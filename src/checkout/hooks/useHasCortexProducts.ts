import { useCheckout } from "@/checkout/hooks/useCheckout";

/**
 * Hook to detect if any products in the checkout have the "cortex" platform attribute
 * This is used to conditionally show Cortex Cloud username and confirmation fields
 */
export const useHasCortexProducts = () => {
	const { checkout } = useCheckout();

	const hasCortexProducts = checkout?.lines?.some((line) => {
		// Find the Platform attribute in the variant's attributes
		const attributes = line.variant?.attributes;

		if (!attributes || attributes.length === 0) {
			return false;
		}

		// Look through all attributes to find one related to "platform"
		return attributes.some((attr) => {
			// Check if any value indicates "cortex"
			return attr.values?.some((val) => {
				const name = val.name?.toLowerCase() || "";
				const translatedName = val.translation?.name?.toLowerCase() || "";

				return name === "cortex" || translatedName === "cortex";
			});
		});
	}) ?? false;

	return hasCortexProducts;
};
