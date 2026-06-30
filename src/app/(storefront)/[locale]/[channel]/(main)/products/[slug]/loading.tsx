import { ProductRouteSkeleton } from "@/ui/components/pdp/product-route-skeleton";

/**
 * Product page skeleton — shown immediately on route transitions (Next.js 16.3 instant nav).
 */
export default function ProductLoading() {
	return <ProductRouteSkeleton surface="route" />;
}
