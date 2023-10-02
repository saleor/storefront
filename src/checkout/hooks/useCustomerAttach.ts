import { useEffect, useMemo } from "react";
import { useCheckoutCustomerAttachMutation } from "@/checkout/graphql";
import { useSubmit } from "@/checkout/hooks/useSubmit/useSubmit";
import { useUser } from "@/checkout/hooks/useUser";
import { useCheckout } from "@/checkout/hooks/useCheckout";

export const useCustomerAttach = () => {
	const { checkout, loading, refetch } = useCheckout();
	const { authenticated } = useUser();

	const [{ fetching }, customerAttach] = useCheckoutCustomerAttachMutation();

	const onSubmit = useSubmit<{}, typeof customerAttach>(
		useMemo(
			() => ({
				hideAlerts: true,
				scope: "checkoutCustomerAttach",
				shouldAbort: () => !!checkout?.user?.id || !authenticated || fetching || loading,
				onSubmit: customerAttach,
				parse: ({ languageCode, checkoutId }) => ({ languageCode, checkoutId }),
				onError: ({ errors }) => {
					if (
						errors.some(
							(error) =>
								error?.message?.includes(
									"[GraphQL] You cannot reassign a checkout that is already attached to a user.",
								),
						)
					) {
						refetch();
					}
				},
			}),
			[authenticated, checkout?.user?.id, customerAttach, fetching, loading, refetch],
		),
	);

	useEffect(() => {
		void onSubmit();
	}, [onSubmit]);
};
