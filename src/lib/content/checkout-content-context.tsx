"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import type { CheckoutContent } from "@/lib/content/types";

const CheckoutContentContext = createContext<CheckoutContent>(defaultStorefrontContent.surfaces.checkout);

export function CheckoutContentProvider({
	content,
	children,
}: {
	content: CheckoutContent;
	children: ReactNode;
}) {
	return <CheckoutContentContext.Provider value={content}>{children}</CheckoutContentContext.Provider>;
}

export function useCheckoutContent(): CheckoutContent {
	return useContext(CheckoutContentContext);
}
