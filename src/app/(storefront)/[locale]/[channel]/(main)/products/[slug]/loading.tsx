import { ProductRouteSkeleton } from "@/ui/components/pdp/product-route-skeleton";

/**
 * Product page skeleton — fallback for cache misses and route transitions.
 *
 * Uses delayed visibility (500ms) to prevent flash on fast loads.
 * With `use cache`, most loads complete in <300ms, so users won't see this.
 * Only shows when there's a genuine wait (cold cache, slow connection).
 */
export default function ProductLoading() {
	return <ProductRouteSkeleton surface="route" />;
}
