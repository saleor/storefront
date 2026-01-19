import { useCheckoutCustomerAttachMutation } from "@/checkout/graphql";
import { useUser } from "@/checkout/hooks/use-user";
import { useCheckout } from "@/checkout/hooks/use-checkout";
import { useSafeMutationOnce } from "@/checkout/hooks/use-safe-mutation";
import { localeConfig } from "@/config/locale";

/**
 * Attaches the logged-in user to the checkout.
 *
 * Runs once when user is authenticated and checkout doesn't have a user.
 * Retry logic is handled at the fetch level.
 */
export const useCustomerAttach = () => {
	const { checkout, fetching: fetchingCheckout, refetch } = useCheckout();
	const { authenticated } = useUser();
	const [{ fetching }, customerAttach] = useCheckoutCustomerAttachMutation();

	const checkoutId = checkout?.id;
	const checkoutUserId = checkout?.user?.id;

	// Skip if: already has user, not authenticated, still loading, or no checkout
	const shouldSkip = !!checkoutUserId || !authenticated || fetchingCheckout || fetching || !checkoutId;

	useSafeMutationOnce(
		customerAttach,
		{ checkoutId: checkoutId || "", languageCode: localeConfig.graphqlLanguageCode },
		{
			skip: shouldSkip,
			deps: [checkoutId, authenticated],
			onError: (error) => {
				// "Already attached" is fine - just refetch to sync state
				if (error.message?.includes("cannot reassign")) {
					refetch();
				}
			},
		},
	);
};
