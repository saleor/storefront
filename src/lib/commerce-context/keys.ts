/**
 * Commerce Context — sectioned public metadata that Saleor Pulse composes on
 * `ORDER_CREATED` (spec: saleor-analytics `docs/data-layer/commerce-context-spec.md`).
 *
 * Paper writes these on the *checkout*; Saleor copies checkout public metadata onto
 * the order at `checkoutComplete`, so no order-side write is needed. Key names are
 * duplicated here on purpose — Paper must not depend on Pulse code, only on the spec.
 *
 * One owner per key: the browse storefront owns `origin`, `marketing`, `session`
 * and `ext.paper`. It never writes `experiment` or any `pulse.*` key. It writes
 * `actors` only when Paper is that system (dedicated agent route → `actors.agent`).
 *
 * Distinct from `paper.marketing_opt_in*` (`@/checkout/lib/marketing-consent/keys`),
 * which records the shopper's *newsletter* choice for merchant apps — not attribution.
 */
export const COMMERCE_CONTEXT_KEYS = {
	origin: "commerce.context.origin",
	marketing: "commerce.context.marketing",
	session: "commerce.context.session",
	actors: "commerce.context.actors",
	/** Vendor extension bag; free-form JSON, ignored by Pulse's typed sections. */
	extPaper: "commerce.context.ext.paper",
} as const;

/** `origin.surface` value for the browse storefront and the checkout surface. */
export const COMMERCE_CONTEXT_SURFACE_STOREFRONT = "storefront";

/** `origin.surface` for a Paper-owned agent checkout — not a shopper with a banner. */
export const COMMERCE_CONTEXT_SURFACE_AGENT = "agent";

/** `origin.system` — identifies the writer implementation, not the deployment. */
export const COMMERCE_CONTEXT_SYSTEM_PAPER = "paper";

/**
 * `origin.consent` — whether storage-derived sections (`marketing` / `session`)
 * are allowed. Origin itself is never consent-gated. `not_required` is implied
 * storefront *or* no shopper cookie (agent / POS / import). `unknown` is the
 * human storefront while `required` has no decision yet.
 */
export const ORIGIN_CONSENT_VALUES = ["granted", "denied", "not_required", "unknown"] as const;
export type OriginConsent = (typeof ORIGIN_CONSENT_VALUES)[number];

export type CommerceContextMetadataInput = {
	key: string;
	value: string;
};
