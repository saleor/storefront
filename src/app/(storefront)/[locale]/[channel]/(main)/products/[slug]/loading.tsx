import { ProductRouteSkeleton } from "@/ui/components/pdp/product-route-skeleton";

/**
 * Product page skeleton — delayed fade-in on route transitions to avoid flash on fast loads.
 */
export default function ProductLoading() {
	return <ProductRouteSkeleton surface="route" />;
}
