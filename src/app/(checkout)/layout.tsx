import { type ReactNode } from "react";
import { brandConfig, formatPageTitle } from "@/config/brand";

export const metadata = {
	title: formatPageTitle("Checkout"),
	description: brandConfig.description,
};

/**
 * Checkout surface layout — no storefront chrome (header/footer).
 * Auth and GraphQL providers live in `CheckoutApp`.
 */
export default function CheckoutLayout(props: { children: ReactNode }) {
	return <main className="min-h-dvh">{props.children}</main>;
}
