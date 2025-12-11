"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ViewToggle } from "./ViewToggle";
import { SortBy } from "./SortBy";

export interface ProductListHeaderProps {
	productCount: number;
	currentSort?: string;
	currentView?: "grid" | "list";
}

export function ProductListHeader({ 
	productCount, 
	currentSort: _currentSort,
	currentView = "grid" 
}: ProductListHeaderProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const handleViewChange = (view: "grid" | "list") => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("view", view);
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	return (
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-secondary-200">
			{/* Product Count */}
			<p className="text-sm text-secondary-600">
				Showing <span className="font-medium text-secondary-900">{productCount}</span> products
			</p>

			{/* Controls */}
			<div className="flex items-center gap-4">
				<SortBy />
				<ViewToggle view={currentView} onViewChange={handleViewChange} />
			</div>
		</div>
	);
}