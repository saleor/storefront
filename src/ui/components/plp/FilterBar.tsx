"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/ui/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
	DropdownMenuCheckboxItem,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from "@/ui/components/ui/DropdownMenu";
import { Badge } from "@/ui/components/ui/Badge";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetCloseButton,
} from "@/ui/components/ui/Sheet";
import { Check } from "lucide-react";

export type SortOption = "featured" | "newest" | "price_asc" | "price_desc" | "bestselling";

export interface FilterOption {
	name: string;
	count: number;
	hex?: string; // For colors
}

export interface CategoryFilterOption {
	id: string;
	name: string;
	slug: string;
	count: number;
}

export interface ActiveFilter {
	key: string;
	label: string;
	value: string;
}

interface FilterBarProps {
	resultCount: number;
	sortValue: SortOption;
	onSortChange: (value: SortOption) => void;
	activeFilters?: readonly ActiveFilter[];
	onRemoveFilter?: (key: string, value: string) => void;
	onClearFilters?: () => void;
	// Filter options
	categoryOptions?: readonly CategoryFilterOption[];
	colorOptions?: readonly FilterOption[];
	sizeOptions?: readonly FilterOption[];
	priceRanges?: readonly { label: string; value: string; count: number }[];
	// Selected filters
	selectedCategories?: readonly string[];
	selectedColors?: readonly string[];
	selectedSizes?: readonly string[];
	selectedPriceRange?: string | null;
	// Filter handlers
	onCategoryToggle?: (slug: string) => void;
	onColorToggle?: (color: string) => void;
	onSizeToggle?: (size: string) => void;
	onPriceRangeChange?: (range: string | null) => void;
}

export function FilterBar({
	resultCount,
	sortValue,
	onSortChange,
	activeFilters = [],
	onRemoveFilter,
	onClearFilters,
	categoryOptions = [],
	colorOptions = [],
	sizeOptions = [],
	priceRanges = [],
	selectedCategories = [],
	selectedColors = [],
	selectedSizes = [],
	selectedPriceRange = null,
	onCategoryToggle,
	onColorToggle,
	onSizeToggle,
	onPriceRangeChange,
}: FilterBarProps) {
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

	const hasFilters =
		categoryOptions.length > 0 || colorOptions.length > 0 || sizeOptions.length > 0 || priceRanges.length > 0;

	const activeFilterCount =
		selectedCategories.length + selectedColors.length + selectedSizes.length + (selectedPriceRange ? 1 : 0);

	return (
		<div className="sticky top-16 z-30 border-b border-border bg-background">
			<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
				{/* Main Filter Row */}
				<div className="flex items-center justify-between gap-4">
					{/* Left: Filters */}
					{/* -mx-1 px-1 py-1 -my-1 provides breathing room for focus rings inside overflow */}
					<div className="scrollbar-hide -mx-1 -my-1 flex items-center gap-2 overflow-x-auto px-1 py-1">
						{/* All Filters Button (Mobile) - Opens Sheet */}
						{hasFilters && (
							<Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
								<SheetTrigger asChild>
									<Button variant="outline-solid" size="sm" className="shrink-0 bg-transparent md:hidden">
										<SlidersHorizontal className="mr-2 h-4 w-4" />
										Filters
										{activeFilterCount > 0 && (
											<Badge variant="secondary" className="ml-2 h-5 px-1.5 py-0 text-xs">
												{activeFilterCount}
											</Badge>
										)}
									</Button>
								</SheetTrigger>
								<SheetContent side="left" className="flex w-[280px] flex-col p-0">
									<SheetHeader className="flex-row items-center justify-between border-b border-border px-4 py-4">
										<SheetTitle>Filters</SheetTitle>
										<SheetCloseButton />
									</SheetHeader>

									<div className="flex-1 overflow-y-auto">
										<div className="divide-y divide-border">
											{/* Mobile Category Filter */}
											{categoryOptions.length > 0 && onCategoryToggle && (
												<div className="px-4 py-6">
													<h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
														Category
													</h3>
													<div className="space-y-3">
														{categoryOptions.map((category) => {
															const isSelected = selectedCategories.includes(category.slug);
															return (
																<button
																	key={category.slug}
																	onClick={() => onCategoryToggle(category.slug)}
																	className="flex w-full items-center gap-3 text-left"
																>
																	<span
																		className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
																			isSelected
																				? "border-foreground bg-foreground text-background"
																				: "border-border"
																		}`}
																	>
																		{isSelected && <Check className="h-3 w-3" />}
																	</span>
																	<span className="text-sm">{category.name}</span>
																</button>
															);
														})}
													</div>
												</div>
											)}

											{/* Mobile Color Filter */}
											{colorOptions.length > 0 && onColorToggle && (
												<div className="px-4 py-6">
													<h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
														Color
													</h3>
													<div className="space-y-3">
														{colorOptions.map((color) => {
															const isSelected = selectedColors.includes(color.name);
															return (
																<button
																	key={color.name}
																	onClick={() => onColorToggle(color.name)}
																	className="flex w-full items-center gap-3 text-left"
																>
																	<span
																		className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
																			isSelected
																				? "border-foreground bg-foreground text-background"
																				: "border-border"
																		}`}
																	>
																		{isSelected && <Check className="h-3 w-3" />}
																	</span>
																	{color.hex && (
																		<span
																			className="h-5 w-5 shrink-0 rounded-full border border-border"
																			style={{ backgroundColor: color.hex }}
																		/>
																	)}
																	<span className="flex-1 text-sm">{color.name}</span>
																	<span className="text-xs text-muted-foreground">({color.count})</span>
																</button>
															);
														})}
													</div>
												</div>
											)}

											{/* Mobile Size Filter */}
											{sizeOptions.length > 0 && onSizeToggle && (
												<div className="px-4 py-6">
													<h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
														Size
													</h3>
													<div className="flex flex-wrap gap-2">
														{sizeOptions.map((size) => {
															const isSelected = selectedSizes.includes(size.name);
															return (
																<button
																	key={size.name}
																	onClick={() => onSizeToggle(size.name)}
																	className={`rounded-md border px-4 py-2 text-sm transition-colors ${
																		isSelected
																			? "border-foreground bg-foreground text-background"
																			: "border-border hover:border-foreground"
																	}`}
																>
																	{size.name}
																</button>
															);
														})}
													</div>
												</div>
											)}

											{/* Mobile Price Filter */}
											{priceRanges.length > 0 && onPriceRangeChange && (
												<div className="px-4 py-6">
													<h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
														Price
													</h3>
													<div className="space-y-3">
														{priceRanges.map((range) => {
															const isSelected = selectedPriceRange === range.value;
															return (
																<button
																	key={range.value}
																	onClick={() => onPriceRangeChange(isSelected ? null : range.value)}
																	className="flex w-full items-center gap-3 text-left"
																>
																	<span
																		className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
																			isSelected ? "border-foreground bg-foreground" : "border-border"
																		}`}
																	>
																		{isSelected && <span className="h-2 w-2 rounded-full bg-background" />}
																	</span>
																	<span className="text-sm">{range.label}</span>
																</button>
															);
														})}
													</div>
												</div>
											)}
										</div>
									</div>

									{/* Footer with Clear/Apply buttons */}
									{activeFilterCount > 0 && onClearFilters && (
										<div className="border-t border-border p-4">
											<Button
												variant="outline-solid"
												className="w-full"
												onClick={() => {
													onClearFilters();
													setMobileFiltersOpen(false);
												}}
											>
												Clear all filters ({activeFilterCount})
											</Button>
										</div>
									)}
								</SheetContent>
							</Sheet>
						)}

						{/* Category Filter - counts hidden since filtering is server-side */}
						{categoryOptions.length > 0 && onCategoryToggle && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline-solid"
										size="sm"
										className="hidden shrink-0 bg-transparent md:flex"
									>
										Category
										{selectedCategories.length > 0 && (
											<Badge variant="secondary" className="ml-2 h-5 px-1.5 py-0 text-xs">
												{selectedCategories.length}
											</Badge>
										)}
										<ChevronDown className="ml-1.5 h-4 w-4 opacity-50" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-56">
									<DropdownMenuLabel>Category</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{categoryOptions.map((category) => (
										<DropdownMenuCheckboxItem
											key={category.slug}
											checked={selectedCategories.includes(category.slug)}
											onCheckedChange={() => onCategoryToggle(category.slug)}
										>
											{category.name}
										</DropdownMenuCheckboxItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						)}

						{/* Color Filter */}
						{colorOptions.length > 0 && onColorToggle && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline-solid"
										size="sm"
										className="hidden shrink-0 bg-transparent md:flex"
									>
										Color
										{selectedColors.length > 0 && (
											<Badge variant="secondary" className="ml-2 h-5 px-1.5 py-0 text-xs">
												{selectedColors.length}
											</Badge>
										)}
										<ChevronDown className="ml-1.5 h-4 w-4 opacity-50" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-56">
									<DropdownMenuLabel>Color</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{colorOptions.map((color) => (
										<DropdownMenuCheckboxItem
											key={color.name}
											checked={selectedColors.includes(color.name)}
											onCheckedChange={() => onColorToggle(color.name)}
										>
											{color.hex && (
												<span
													className="mr-2 h-4 w-4 shrink-0 rounded-full border border-border"
													style={{ backgroundColor: color.hex }}
												/>
											)}
											<span className="flex-1">{color.name}</span>
											<span className="text-xs text-muted-foreground">({color.count})</span>
										</DropdownMenuCheckboxItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						)}

						{/* Size Filter */}
						{sizeOptions.length > 0 && onSizeToggle && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline-solid"
										size="sm"
										className="hidden shrink-0 bg-transparent md:flex"
									>
										Size
										{selectedSizes.length > 0 && (
											<Badge variant="secondary" className="ml-2 h-5 px-1.5 py-0 text-xs">
												{selectedSizes.length}
											</Badge>
										)}
										<ChevronDown className="ml-1.5 h-4 w-4 opacity-50" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-48">
									<DropdownMenuLabel>Size</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{sizeOptions.map((size) => (
										<DropdownMenuCheckboxItem
											key={size.name}
											checked={selectedSizes.includes(size.name)}
											onCheckedChange={() => onSizeToggle(size.name)}
										>
											<span className="flex-1">{size.name}</span>
											<span className="text-xs text-muted-foreground">({size.count})</span>
										</DropdownMenuCheckboxItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						)}

						{/* Price Filter - counts hidden since filtering is server-side */}
						{priceRanges.length > 0 && onPriceRangeChange && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline-solid"
										size="sm"
										className="hidden shrink-0 bg-transparent md:flex"
									>
										Price
										{selectedPriceRange && (
											<Badge variant="secondary" className="ml-2 h-5 px-1.5 py-0 text-xs">
												1
											</Badge>
										)}
										<ChevronDown className="ml-1.5 h-4 w-4 opacity-50" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-48">
									<DropdownMenuLabel>Price Range</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuRadioGroup
										value={selectedPriceRange || ""}
										onValueChange={(v) => onPriceRangeChange(v || null)}
									>
										{priceRanges.map((range) => (
											<DropdownMenuRadioItem key={range.value} value={range.value}>
												{range.label}
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>

					{/* Right: Result Count + Sort */}
					<div className="flex shrink-0 items-center gap-3">
						<span className="hidden text-sm text-muted-foreground sm:block">
							{resultCount} {resultCount === 1 ? "product" : "products"}
						</span>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline-solid" size="sm" className="bg-transparent">
									Sort
									<ChevronDown className="ml-1.5 h-4 w-4 opacity-50" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuRadioGroup
									value={sortValue}
									onValueChange={(v) => onSortChange(v as SortOption)}
								>
									<DropdownMenuRadioItem value="featured">Featured</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="price_asc">Price: Low to High</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="price_desc">Price: High to Low</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="bestselling">Best Selling</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Active Filters Row */}
				{activeFilters.length > 0 && onRemoveFilter && onClearFilters && (
					<div className="scrollbar-hide -mx-1 mt-3 flex items-center gap-2 overflow-x-auto px-1 py-1">
						{activeFilters.map((filter) => (
							<Badge
								key={`${filter.key}-${filter.value}`}
								variant="secondary"
								className="shrink-0 gap-1.5 pr-1.5"
							>
								<span className="text-xs text-muted-foreground">{filter.label}:</span>
								{filter.value}
								<button
									onClick={() => onRemoveFilter(filter.key, filter.value)}
									className="hover:bg-background/50 ml-0.5 rounded-full p-0.5 transition-colors"
								>
									<X className="h-3 w-3" />
									<span className="sr-only">Remove {filter.value} filter</span>
								</button>
							</Badge>
						))}
						<Button
							variant="ghost"
							size="sm"
							className="h-6 shrink-0 px-2 text-xs text-muted-foreground"
							onClick={onClearFilters}
						>
							Clear all
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
