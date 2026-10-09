import { ProductsGridSkeleton } from "@/ui/components/plp/products-grid-skeleton";
import { definePlpTemplate } from "@/lib/storefront/templates";
import { PlpPresetLayout } from "@/templates/plp/preset-layout";

function SidebarSkeleton() {
	return <ProductsGridSkeleton />;
}

export const sidebarPlp = definePlpTemplate({
	id: "sidebar",
	facets: "sidebar",
	Layout: PlpPresetLayout,
	Skeleton: SidebarSkeleton,
});
