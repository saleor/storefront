import type { CheckoutErrorFragment, ValidationRulesFragment } from "@/checkout/graphql";
import type { DeliveryOption, ServerCheckout } from "@/checkout/lib/checkout-types";
import type { TransactionInitializePayload } from "@/checkout/lib/payment/types";

export type CheckoutFieldError = Pick<CheckoutErrorFragment, "field" | "message" | "code">;

export type CheckoutActionResult =
	| { ok: true; checkout: ServerCheckout }
	| { ok: false; error?: string; fieldErrors?: CheckoutFieldError[] };

export type SimpleActionResult =
	| { ok: true }
	| { ok: false; error?: string; fieldErrors?: CheckoutFieldError[] };

export type DeliveryOptionsActionResult =
	| { ok: true; deliveries: DeliveryOption[] }
	| { ok: false; error: string };

export type AddressValidationRulesActionResult =
	| { ok: true; rules: ValidationRulesFragment }
	| { ok: false; error: string };

export type TransactionInitializeActionResult =
	| { ok: true; data: NonNullable<TransactionInitializePayload> }
	| { ok: false; error: string };

export type CheckoutCompleteActionResult =
	| { ok: true; orderId: string }
	| { ok: false; error: string; fieldErrors?: CheckoutFieldError[] };
