/**
 * Re-export generated GraphQL types for checkout.
 *
 * Mutations and queries run via server actions (`src/app/(checkout)/actions.ts`),
 * not urql hooks. Hook exports live in `./generated/index.ts` for codegen only.
 *
 * To regenerate types, run: pnpm generate:checkout
 */
export * from "./generated/operations";

// Type aliases for backwards compatibility
// The codegen adds "Fragment" suffix to fragment types (e.g., AddressFragmentFragment)
// These aliases provide cleaner names that match the original fragment names
export type {
	AddressFragmentFragment as AddressFragment,
	CheckoutFragmentFragment as CheckoutFragment,
	CheckoutLineFragmentFragment as CheckoutLineFragment,
	CheckoutErrorFragmentFragment as CheckoutErrorFragment,
	GiftCardFragmentFragment as GiftCardFragment,
	ValidationRulesFragmentFragment as ValidationRulesFragment,
	PaymentGatewayFragmentFragment as PaymentGatewayFragment,
	OrderFragmentFragment as OrderFragment,
	OrderLineFragmentFragment as OrderLineFragment,
	ShippingFragmentFragment as ShippingFragment,
	MoneyFragment as Money,
	AccountErrorFragmentFragment as AccountErrorFragment,
	UserFragmentFragment as UserFragment,
} from "./generated/operations";
