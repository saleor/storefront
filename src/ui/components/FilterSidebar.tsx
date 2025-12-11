"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { clsx } from "clsx";

export interface FilterOption {
	label: string;
	value: string;
	count?: number;
}

export interface FilterGroup {
	id: string;
	name: string;
	options: FilterOption[];
	type: "checkbox" | "radio" | "range";
}

export interface FilterSidebarProps {
	filters: FilterGroup[];
	className?: string;
}

export function FilterSidebar({ filters, className }: FilterSidebarProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [expandedGroups, setExpandedGroups] = useState<string[]>(filters.map(f => f.id));

	const toggleGroup = (groupId: string) => {
		setExpandedGroups(prev => 
			prev.includes(groupId) 
				? prev.filter(id => id !== groupId)
				: [...prev, groupId]
		);
	};

	const getSelectedValues = (groupId: string): string[] => {
		const value = searchParams.get(groupId);
		return value ? value.split(",") : [];
	};

	const handleFilterChange = (groupId: string, value: string, checked: boolean) => {
		const params = new URLSearchParams(searchParams.toString());
		const currentValues = getSelectedValues(groupId);
		
		let newValues: string[];
		if (checked) {
			newValues = [...currentValues, value];
		} else {
			newValues = currentValues.filter(v => v !== value);
		}

		if (newValues.length > 0) {
			params.set(groupId, newValues.join(","));
		} else {
			params.delete(groupId);
		}

		// Reset pagination when filters change
		params.delete("cursor");
		params.delete("direction");

		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const clearAllFilters = () => {
		const params = new URLSearchParams();
		// Keep sort and view params
		const sort = searchParams.get("sort");
		const view = searchParams.get("view");
		if (sort) params.set("sort", sort);
		if (view) params.set("view", view);
		
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const hasActiveFilters = filters.some(group => getSelectedValues(group.id).length > 0);

	return (
		<aside className={clsx("w-full", className)}>
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-secondary-900">Filters</h2>
				{hasActiveFilters && (
					<button
						onClick={clearAllFilters}
						className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
					>
						Clear all
					</button>
				)}
			</div>

			{/* Filter Groups */}
			<div className="space-y-4">
				{filters.map((group) => {
					const isExpanded = expandedGroups.includes(group.id);
					const selectedValues = getSelectedValues(group.id);

					return (
						<div key={group.id} className="border-b border-secondary-200 pb-4">
							<button
								onClick={() => toggleGroup(group.id)}
								className="flex items-center justify-between w-full py-2 text-left"
							>
								<span className="text-sm font-medium text-secondary-900">
									{group.name}
									{selectedValues.length > 0 && (
										<span className="ml-2 text-xs text-primary-600">
											({selectedValues.length})
										</span>
									)}
								</span>
								{isExpanded ? (
									<ChevronUp className="h-4 w-4 text-secondary-500" />
								) : (
									<ChevronDown className="h-4 w-4 text-secondary-500" />
								)}
							</button>

							{isExpanded && (
								<div className="mt-2 space-y-2">
									{group.options.map((option) => {
										const isSelected = selectedValues.includes(option.value);
										
										return (
											<label
												key={option.value}
												className="flex items-center gap-2 cursor-pointer group"
											>
												<input
													type="checkbox"
													checked={isSelected}
													onChange={(e) => handleFilterChange(group.id, option.value, e.target.checked)}
													className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
												/>
												<span className={clsx(
													"text-sm transition-colors",
													isSelected ? "text-secondary-900 font-medium" : "text-secondary-600 group-hover:text-secondary-900"
												)}>
													{option.label}
												</span>
												{option.count !== undefined && (
													<span className="text-xs text-secondary-400">
														({option.count})
													</span>
												)}
											</label>
										);
									})}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</aside>
	);
}