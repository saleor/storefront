"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Re-run checkout RSC trees (`CheckoutSessionLoader`, `me`, countries) after auth or
 * address-book changes. Client checkout state is merged via `adoptCheckoutSnapshot` when
 * line items are unchanged; use `refreshCheckout()` when totals or lines must update immediately.
 */
export function useRefreshCheckoutRsc() {
	const router = useRouter();

	return useCallback(() => {
		router.refresh();
	}, [router]);
}
