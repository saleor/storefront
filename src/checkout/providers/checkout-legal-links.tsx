"use client";

import { createContext, use, type ReactNode } from "react";

/**
 * URLs of the shop's legal pages that exist in Saleor (slugs in `src/config/legal.ts`),
 * resolved on the server by the checkout session loader. A missing page has no entry.
 */
export type CheckoutLegalLinks = {
	terms?: string;
	withdrawal?: string;
	privacy?: string;
};

const CheckoutLegalLinksContext = createContext<CheckoutLegalLinks>({});

export function CheckoutLegalLinksProvider({
	links,
	children,
}: {
	links: CheckoutLegalLinks;
	children: ReactNode;
}) {
	return <CheckoutLegalLinksContext value={links}>{children}</CheckoutLegalLinksContext>;
}

export function useCheckoutLegalLinks(): CheckoutLegalLinks {
	return use(CheckoutLegalLinksContext);
}
