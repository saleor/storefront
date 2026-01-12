/**
 * Re-export all generated GraphQL types and hooks.
 *
 * This barrel file allows importing from "@/checkout/graphql" without
 * changing existing imports. The actual types are generated in ./generated/.
 *
 * To regenerate types, run: pnpm generate:checkout
 */
export * from "./generated";

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
} from "./generated";
