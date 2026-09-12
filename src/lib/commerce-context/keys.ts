/**
 * Commerce Context — sectioned public metadata that Saleor Pulse composes on
 * `ORDER_CREATED` (spec: saleor-analytics `docs/data-layer/commerce-context-spec.md`).
 *
 * Paper writes these on the *checkout*; Saleor copies checkout public metadata onto
 * the order at `checkoutComplete`, so no order-side write is needed. Key names are
 * duplicated here on purpose — Paper must not depend on Pulse code, only on the spec.
 *
 * One owner per key: Paper owns `origin`, `marketing`, `session` and `ext.paper`.
 * It never writes `actors` / `experiment` (those belong to affiliate / A-B tooling)
 * and never writes any `pulse.*` key (Pulse private namespace).
 *
 * Distinct from `paper.marketing_opt_in*` (`@/checkout/lib/marketing-consent/keys`),
 * which records the shopper's *newsletter* choice for merchant apps — not attribution.
 */
export const COMMERCE_CONTEXT_KEYS = {
	origin: "commerce.context.origin",
	marketing: "commerce.context.marketing",
	session: "commerce.context.session",
	/** Vendor extension bag; free-form JSON, ignored by Pulse's typed sections. */
	extPaper: "commerce.context.ext.paper",
} as const;

/** `origin.surface` value for anything Paper creates — the storefront and the checkout surface alike. */
export const COMMERCE_CONTEXT_SURFACE_STOREFRONT = "storefront";

/** `origin.system` — identifies the writer implementation, not the deployment. */
export const COMMERCE_CONTEXT_SYSTEM_PAPER = "paper";

/**
 * Pulse `origin.consent` — whether the shopper allowed storage that marketing /
 * session are derived from. Origin itself is never consent-gated; the marker
 * lives here so "declined" is not indistinguishable from "direct".
 */
export const ORIGIN_CONSENT_VALUES = ["granted", "denied", "not_required", "unknown"] as const;
export type OriginConsent = (typeof ORIGIN_CONSENT_VALUES)[number];

export type CommerceContextMetadataInput = {
	key: string;
	value: string;
};
