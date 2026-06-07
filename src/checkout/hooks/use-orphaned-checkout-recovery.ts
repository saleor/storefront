import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { recoverOrphanedCheckout } from "@/app/(checkout)/actions";
import type { CheckoutFragment } from "@/checkout/graphql";
import { useRefreshCheckoutRsc } from "@/checkout/hooks/use-refresh-checkout-rsc";
import { useUser } from "@/checkout/hooks/use-user";
import { createQueryString } from "@/checkout/lib/utils/url";
import { useCheckoutData } from "@/checkout/providers/checkout-data";

/**
 * A checkout is "orphaned" when it still has checkout.user set but the browser session is logged out.
 * Saleor blocks guest email updates on user-owned checkouts — recover by cloning to a new anonymous cart.
 */
export function useOrphanedCheckoutRecovery(checkout: CheckoutFragment) {
	const router = useRouter();
	const refreshCheckoutRsc = useRefreshCheckoutRsc();
	const searchParams = useSearchParams();
	const { authenticated } = useUser();
	const { setCheckout } = useCheckoutData();
	const [isRecovering, setIsRecovering] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isOrphaned = !authenticated && Boolean(checkout.user?.id);

	const recoverAsGuest = useCallback(async () => {
		if (!isOrphaned || isRecovering) {
			return;
		}

		setIsRecovering(true);
		setError(null);

		try {
			const lines = checkout.lines.map((line) => ({
				variantId: line.variant.id,
				quantity: line.quantity,
			}));

			const result = await recoverOrphanedCheckout(checkout.channel.slug, lines);

			if (!result.ok) {
				const message = result.error ?? result.fieldErrors?.[0]?.message ?? "Could not continue as guest";
				throw new Error(message);
			}

			setCheckout(result.checkout);

			if (result.checkoutId) {
				const newQuery = createQueryString(searchParams, { checkoutId: result.checkoutId });
				router.replace(`?${newQuery}`, { scroll: false });
			}

			refreshCheckoutRsc();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not continue as guest");
		} finally {
			setIsRecovering(false);
		}
	}, [
		checkout.channel.slug,
		checkout.lines,
		isOrphaned,
		isRecovering,
		refreshCheckoutRsc,
		router,
		searchParams,
		setCheckout,
	]);

	return { isOrphaned, isRecovering, error, recoverAsGuest };
}
