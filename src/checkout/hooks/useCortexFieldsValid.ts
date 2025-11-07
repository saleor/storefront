import { useHasCortexProducts } from "@/checkout/hooks/useHasCortexProducts";
import { useCortexDataStore } from "@/checkout/state/cortexDataStore";

/**
 * Hook to check if Cortex Cloud fields are valid
 * Returns true if:
 * - No Cortex products in cart (fields not required), OR
 * - Cortex products exist AND both fields are filled correctly
 */
export const useCortexFieldsValid = (): boolean => {
	const hasCortexProducts = useHasCortexProducts();
	const { cortexData } = useCortexDataStore();

	// If no Cortex products, validation passes
	if (!hasCortexProducts) {
		return true;
	}

	// If Cortex products exist, both fields must be valid
	const hasUsername = !!cortexData?.cortexCloudUsername && cortexData.cortexCloudUsername.length > 0;
	const hasFollowConfirmed = cortexData?.cortexFollowConfirmed === true;

	return hasUsername && hasFollowConfirmed;
};
