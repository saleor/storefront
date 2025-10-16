/**
 * Optimized Stripe Component
 *
 * Replaces the problematic stripeComponent.tsx with:
 * - Proper idempotency management
 * - Prevention of excessive API calls
 * - Optimized React effects
 * - Clean separation of concerns
 */

"use client";

import { type FC } from "react";
import { StripeElementsProvider } from "./StripeElementsProvider";
import { StripeCheckoutForm } from "./StripeCheckoutForm";

/**
 * Main Stripe component that provides the complete payment experience
 * with proper lifecycle management and idempotency protection.
 */
export const OptimizedStripeComponent: FC = () => {
	return (
		<StripeElementsProvider>
			<StripeCheckoutForm />
		</StripeElementsProvider>
	);
};

// Export for backward compatibility
export { OptimizedStripeComponent as StripeComponent };
