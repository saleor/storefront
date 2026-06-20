import { cn } from "@/lib/utils";
import { productGridDesktopClassName, type ProductGridDesktopColumns } from "./product-grid";

export function ProductsGridSkeleton({
	className,
	desktopColumns = 3,
	itemCount = 6,
}: {
	className?: string;
	desktopColumns?: ProductGridDesktopColumns;
	itemCount?: number;
}) {
	return (
		<div className={cn("container-content py-8", className)}>
			<div
				className={cn("grid grid-cols-2 gap-4 lg:gap-6", productGridDesktopClassName[desktopColumns])}
				data-testid="ProductList"
			>
				{Array.from({ length: itemCount }).map((_, i) => (
					<div key={i} className="animate-pulse">
						<div className="mb-4 aspect-[3/4] rounded-card bg-muted" />
						<div className="space-y-1.5">
							<div className="h-4 w-3/4 rounded bg-muted" />
							<div className="h-4 w-1/2 rounded bg-muted" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
