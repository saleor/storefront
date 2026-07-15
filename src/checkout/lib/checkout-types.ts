import type {
	CheckoutQuery,
	DeliveryOptionsCalculateMutation,
	OrderQuery,
	UserQuery,
} from "@/checkout/graphql/generated/operations";
import type { CountryCode } from "@/checkout/graphql";

/** Checkout object returned by the server-side checkout query. */
export type ServerCheckout = NonNullable<CheckoutQuery["checkout"]>;

export type CheckoutLoadState = "none" | "not_found" | "empty" | "error" | "ready";

/** Customer profile from `me` — shared by RSC fetch and client context. */
export type CheckoutUser = NonNullable<UserQuery["user"]>;

/** Order object for confirmation page — server-hydrated. */
export type ServerOrder = NonNullable<OrderQuery["order"]>;

/** Result of `fetchCheckoutOnServer` — distinct from urql/client checkout state. */
export type CheckoutFetchResult = { ok: false } | { ok: true; checkout: ServerCheckout | null };

export type DeliveryOption = DeliveryOptionsCalculateMutation["deliveryOptionsCalculate"] extends
	| { deliveries: infer D }
	| null
	| undefined
	? D extends Array<infer Item>
		? Item
		: never
	: never;

export type ShippingCountryOption = {
	code: CountryCode;
	label: string;
};

export type ShippingCountries = ShippingCountryOption[];
