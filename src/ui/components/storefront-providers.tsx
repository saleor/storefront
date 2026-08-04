"use client";

import { type ReactNode } from "react";
import { CatalogIdentityProvider } from "@/lib/catalog/catalog-identity-bridge";
import { CartProvider } from "@/ui/components/cart/cart-context";

export function StorefrontProviders({ children }: { children: ReactNode }) {
	return (
		<CartProvider>
			<CatalogIdentityProvider>{children}</CatalogIdentityProvider>
		</CartProvider>
	);
}
