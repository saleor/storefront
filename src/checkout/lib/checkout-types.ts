import type {
	CheckoutQuery,
	CheckoutRoutingQuery,
	DeliveryOptionsCalculateMutation,
	OrderQuery,
	UserQuery,
} from "@/checkout/graphql/generated/operations";
import type { CountryCode } from "@/checkout/graphql";

/** Checkout object returned by the server-side checkout query. */
export type ServerCheckout = NonNullable<CheckoutQuery["checkout"]>;

/** Customer profile from `me` — shared by RSC fetch and client context. */
export type CheckoutUser = NonNullable<UserQuery["user"]>;

/** Order object for confirmation page — server-hydrated. */
export type ServerOrder = NonNullable<OrderQuery["order"]>;

/** Result of `fetchCheckoutOnServer` — distinct from urql/client checkout state. */
export type CheckoutFetchResult = { ok: false } | { ok: true; checkout: ServerCheckout | null };

/** Minimal checkout for RSC routing (channel slug, line count, cookie redirect). */
export type CheckoutRouting = NonNullable<CheckoutRoutingQuery["checkout"]>;

/** Result of `fetchCheckoutRoutingOnServer`. */
export type CheckoutRoutingFetchResult = { ok: false } | { ok: true; checkout: CheckoutRouting | null };

export type DeliveryOption = DeliveryOptionsCalculateMutation["deliveryOptionsCalculate"] extends
	| { deliveries: infer D }
	| null
	| undefined
	? D extends Array<infer Item>
		? Item
		: never
	: never;

export type ShippingCountries = CountryCode[];
