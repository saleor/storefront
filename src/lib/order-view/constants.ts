export const ORDER_VIEW_TOKEN_PREFIX = "ov1";
export const ORDER_VIEW_COOKIE_NAME = "paper_order_view";
export const ORDER_VIEW_TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000;
export const ORDER_VIEW_COOKIE_MAX_AGE_SECONDS = 60 * 60;
export const ORDER_VIEW_FIND_RATE_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 } as const;
