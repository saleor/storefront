/**
 * Stripe payment provider (not implemented).
 *
 * To integrate Saleor's Stripe app:
 * 1. Install the Stripe app in Saleor Dashboard
 * 2. Call paymentGatewayInitialize → get client secret from gatewayConfigs
 * 3. Mount @stripe/react-stripe-js PaymentElement in a new component
 * 4. On Pay: transactionInitialize → stripe.confirmPayment() → transactionProcess → checkoutComplete
 *
 * @see https://docs.saleor.io/developer/app-store/apps/stripe
 * @see https://stripe.com/docs/payments/payment-element
 */

export const STRIPE_GATEWAY_ID_PREFIX = "saleor.app.payment.stripe";

export function isStripeGateway(gatewayId: string): boolean {
	return gatewayId.includes("stripe");
}
