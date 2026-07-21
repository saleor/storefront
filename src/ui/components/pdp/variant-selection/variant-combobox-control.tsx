"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DiscountPercentLabel } from "@/ui/components/ui/sale-label";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/ui/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/components/ui/popover";
import { Sheet, SheetCloseButton, SheetContent, SheetHeader, SheetTitle } from "@/ui/components/ui/sheet";
import { useVariantOptionLabels } from "@/ui/components/pdp/use-variant-option-labels";
import type { VariantOption } from "./types";

export interface VariantComboboxControlProps {
	label: string;
	attributeSlug: string;
	options: VariantOption[];
	selectedId?: string;
	onSelect: (optionId: string) => void;
	isPending?: boolean;
	labelId: string;
	placeholder: string;
	searchPlaceholder: string;
	noResultsLabel: string;
}

/** md breakpoint — matches Tailwind `md:` (Popover desktop / Sheet mobile). */
const MD_UP = "(min-width: 768px)";

/**
 * Searchable group control for large attribute lists (and large swatch sets).
 * Lazy-loaded: chips path never imports cmdk / Popover / Sheet.
 * Desktop uses Popover + Command; mobile uses Sheet + Command (same list UX).
 */
export function VariantComboboxControl({
	label,
	options,
	selectedId,
	onSelect,
	isPending,
	labelId,
	placeholder,
	searchPlaceholder,
	noResultsLabel,
}: VariantComboboxControlProps) {
	const [open, setOpen] = useState(false);
	const [isMdUp, setIsMdUp] = useState(false);
	const labels = useVariantOptionLabels();
	const selected = options.find((o) => o.id === selectedId);

	useEffect(() => {
		const mq = window.matchMedia(MD_UP);
		const sync = () => setIsMdUp(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	const handlePick = (optionId: string) => {
		const option = options.find((o) => o.id === optionId);
		if (!option?.available || isPending) return;
		onSelect(optionId);
		setOpen(false);
	};

	const triggerClassName = cn(
		"flex h-12 w-full max-w-md items-center justify-between gap-3 rounded-xl border border-input bg-background px-3.5 text-left text-sm font-medium leading-none",
		"transition-colors duration-150",
		"hover:border-foreground/20",
		"focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		"disabled:cursor-not-allowed disabled:opacity-60",
		open && "border-foreground/25",
	);

	const triggerInner = (
		<>
			<span className="flex min-w-0 flex-1 items-center gap-2.5">
				{selected ? (
					<>
						<OptionSwatch option={selected} />
						<span className="truncate">{selected.name}</span>
					</>
				) : (
					<span className="truncate text-muted-foreground">{placeholder || label}</span>
				)}
			</span>
			<ChevronDown
				className={cn(
					"h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150",
					open && "rotate-180",
				)}
				aria-hidden
			/>
		</>
	);

	const list = (
		<Command
			className="rounded-none bg-transparent"
			filter={(value, search) => (value.includes(search.toLowerCase()) ? 1 : 0)}
		>
			<CommandInput placeholder={searchPlaceholder} aria-label={searchPlaceholder} />
			<CommandList className="max-h-[min(18rem,50vh)]">
				<CommandEmpty>{noResultsLabel}</CommandEmpty>
				<CommandGroup>
					{options.map((option) => {
						const isSelected = option.id === selectedId;
						const isOutOfStock = !option.available;
						const isIncompatible = option.existsWithCurrentSelection === false && !isSelected;
						const hasDiscount = Boolean(option.discountPercent && !isOutOfStock);
						const searchValue = `${option.name} ${option.id}`.toLowerCase();

						return (
							<CommandItem
								key={option.id}
								value={searchValue}
								disabled={isOutOfStock || isPending}
								onSelect={() => handlePick(option.id)}
								title={
									isOutOfStock
										? labels.outOfStockTitle(option.name)
										: isIncompatible
											? labels.willChangeSelections(option.name)
											: option.discountPercent
												? labels.percentOffTitle(option.name, option.discountPercent)
												: undefined
								}
								className={cn(
									"gap-3 py-2.5",
									/* Committed selection stays quiet; keyboard highlight (data-selected) is muted — never inverted slabs */
									isSelected && "font-medium",
									isIncompatible && !isSelected && "text-muted-foreground/55",
									isOutOfStock && "line-through",
								)}
							>
								<OptionSwatch option={option} />
								<span className="flex min-w-0 flex-1 items-baseline gap-2">
									<span className="truncate">{option.name}</span>
									{hasDiscount && option.discountPercent ? (
										<DiscountPercentLabel
											percent={option.discountPercent}
											size="inline"
											className="shrink-0 text-xs tabular-nums"
										/>
									) : null}
								</span>
								<span
									className={cn(
										"flex h-4 w-4 shrink-0 items-center justify-center",
										!isSelected && "opacity-0",
									)}
									aria-hidden={!isSelected}
								>
									<Check className="h-3.5 w-3.5 text-foreground" strokeWidth={2.25} />
								</span>
							</CommandItem>
						);
					})}
				</CommandGroup>
			</CommandList>
		</Command>
	);

	return (
		<div className={cn("transition-opacity duration-150", isPending && "pointer-events-none opacity-60")}>
			{isMdUp ? (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<button
							type="button"
							aria-labelledby={labelId}
							aria-haspopup="listbox"
							aria-expanded={open}
							disabled={isPending}
							className={triggerClassName}
						>
							{triggerInner}
						</button>
					</PopoverTrigger>
					<PopoverContent
						align="start"
						sideOffset={6}
						className="w-[var(--radix-popover-trigger-width)] max-w-md rounded-xl p-0 shadow-lg"
						aria-labelledby={labelId}
					>
						{list}
					</PopoverContent>
				</Popover>
			) : (
				<>
					<button
						type="button"
						aria-labelledby={labelId}
						aria-haspopup="dialog"
						aria-expanded={open}
						disabled={isPending}
						onClick={() => setOpen(true)}
						className={triggerClassName}
					>
						{triggerInner}
					</button>

					<Sheet open={open} onOpenChange={setOpen}>
						<SheetContent
							side="bottom"
							className="flex max-h-[85vh] flex-col rounded-t-2xl p-0"
							aria-describedby={undefined}
						>
							<SheetHeader className="shrink-0 border-b border-border/80 px-4 py-3.5">
								<SheetTitle className="flex-1 text-base font-medium tracking-tight">{label}</SheetTitle>
								<SheetCloseButton />
							</SheetHeader>
							<div className="min-h-0 flex-1 overflow-hidden">{list}</div>
						</SheetContent>
					</Sheet>
				</>
			)}
		</div>
	);
}

function OptionSwatch({ option }: { option: VariantOption }) {
	if (option.swatchImageUrl) {
		return (
			<span className="block h-7 w-7 shrink-0 overflow-hidden rounded-full border border-border/70 bg-muted/40">
				{/* eslint-disable-next-line @next/next/no-img-element -- small remote swatch thumb */}
				<img src={option.swatchImageUrl} alt="" className="h-full w-full object-contain" />
			</span>
		);
	}
	if (option.colorHex) {
		return (
			<span
				className="block h-7 w-7 shrink-0 rounded-full border border-border/70"
				style={{ backgroundColor: option.colorHex }} // design-tokens-allow — catalog swatch hex
				aria-hidden
			/>
		);
	}
	return null;
}
