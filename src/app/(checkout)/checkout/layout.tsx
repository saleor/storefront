import { type ReactNode } from "react";

/**
 * Checkout session layout — no `searchParams` here (App Router layouts cannot read them).
 *
 * Session data loads in `CheckoutSessionLoader` from `?checkout=` only. Step changes use
 * shallow client URL updates (`updateCheckoutQuery`) and must not trigger server refetch.
 */
export default function CheckoutSessionLayout({ children }: { children: ReactNode }) {
	return children;
}
