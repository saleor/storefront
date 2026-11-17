export const ORDER_VIEW_TOKEN_PREFIX = "ov1";
export const ORDER_VIEW_COOKIE_NAME = "paper_order_view";
export const ORDER_VIEW_TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000;
export const ORDER_VIEW_COOKIE_MAX_AGE_SECONDS = 60 * 60;
/** Lookups per visitor IP, hits and misses alike. */
export const ORDER_VIEW_FIND_RATE_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 } as const;
/**
 * Lookups per email, per order number and per order id, from any IP. Every attempt counts, before
 * Saleor is asked, so parallel requests cannot all slip through on a stale count.
 */
export const ORDER_LOOKUP_TARGET_LIMIT = { limit: 10, windowMs: 60 * 60 * 1000 } as const;
