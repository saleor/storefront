import { type ReactNode } from "react";

/**
 * Product page layout - creates an explicit route boundary
 * This prevents the parent /products loading.tsx from showing on PDP routes
 */
export default function ProductLayout({ children }: { children: ReactNode }) {
	return children;
}
