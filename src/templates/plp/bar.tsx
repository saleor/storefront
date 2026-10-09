import { ProductsGridSkeleton } from "@/ui/components/plp/products-grid-skeleton";
import { definePlpTemplate } from "@/lib/storefront/templates";
import { PlpPresetLayout } from "@/templates/plp/preset-layout";

function BarSkeleton() {
	return <ProductsGridSkeleton />;
}

export const barPlp = definePlpTemplate({
	id: "bar",
	facets: "bar",
	Layout: PlpPresetLayout,
	Skeleton: BarSkeleton,
});
