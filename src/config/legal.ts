/**
 * Legal pages
 *
 * Saleor Page slugs Paper treats as the shop's legal pages. Create a page in Saleor with
 * one of these slugs (translated slugs work) and Paper links it from the footer, the
 * sign-up form and the checkout's order button. A page that does not exist is not linked,
 * so the storefront never points at a 404.
 *
 * The imprint is not a Saleor Page: `/imprint` renders the seller's details from the shop
 * (see `src/lib/channels/seller-identity.ts`).
 */
export const legalPageSlugs = {
	terms: "terms",
	privacy: "privacy",
	withdrawal: "withdrawal",
	shipping: "shipping",
} as const;

export type LegalPageKey = keyof typeof legalPageSlugs;

export const LEGAL_PAGE_KEYS = Object.keys(legalPageSlugs) as LegalPageKey[];

/** Path after `/{locale}/{channel}` of the imprint route. */
export const IMPRINT_PATH = "/imprint";

/** The withdrawal function (`/{locale}/{channel}/withdraw`), the same path in every language so links in order emails stay stable. */
export const WITHDRAW_PATH = "/withdraw";
