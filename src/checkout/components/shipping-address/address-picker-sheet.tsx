"use client";

import { type FC, useMemo } from "react";
import { Plus } from "lucide-react";
import { type AddressFragment, type AddressTypeEnum } from "@/checkout/graphql";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetCloseButton } from "@/ui/components/ui/sheet";
import { Button } from "@/ui/components/ui/button";

export interface AddressPickerSheetProps {
	/** Whether the sheet is open */
	open: boolean;
	/** Called when the sheet should close */
	onOpenChange: (open: boolean) => void;
	/** List of saved addresses to choose from */
	addresses: AddressFragment[];
	/** Currently selected address ID */
	selectedAddressId: string | null;
	/** Called when an address is selected */
	onSelectAddress: (id: string) => void;
	/** Default address ID (shows "Default" badge) */
	defaultAddressId?: string;
	/** Title for the sheet */
	title?: string;
	/** Called when "Add new address" is clicked */
	onAddNew?: () => void;
	/** Called when edit is clicked on an address */
	onEdit?: (id: string) => void;
	/** Address type (for display) */
	addressType?: AddressTypeEnum;
}

/**
 * Sheet/modal for selecting from many addresses.
 */
export const AddressPickerSheet: FC<AddressPickerSheetProps> = ({
	open,
	onOpenChange,
	addresses,
	selectedAddressId,
	onSelectAddress,
	defaultAddressId,
	title = "Select address",
	onAddNew,
	onEdit,
}) => {
	// Sort addresses: default first, then alphabetically
	// Note: We don't re-sort based on selection - that would be disorienting.
	// The radio indicator already shows what's selected.
	const sortedAddresses = useMemo(() => {
		return [...addresses].sort((a, b) => {
			// Default address first
			if (a.id === defaultAddressId) return -1;
			if (b.id === defaultAddressId) return 1;
			// Then alphabetically by name
			const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
			const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
			return nameA.localeCompare(nameB);
		});
	}, [addresses, defaultAddressId]);

	const handleSelect = (id: string) => {
		onSelectAddress(id);
		onOpenChange(false);
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="flex flex-col p-0">
				<SheetHeader className="shrink-0 border-b px-4 py-4">
					<SheetCloseButton className="-ml-2" />
					<SheetTitle>{title}</SheetTitle>
				</SheetHeader>

				{/* Address list */}
				<div className="flex-1 overflow-y-auto px-4 py-3">
					{sortedAddresses.length === 0 ? (
						<p className="py-8 text-center text-sm text-muted-foreground">No saved addresses</p>
					) : (
						<div className="space-y-2">
							{sortedAddresses.map((address) => {
								const isSelected = selectedAddressId === address.id;
								const isDefault = defaultAddressId === address.id;

								return (
									<button
										key={address.id}
										type="button"
										onClick={() => handleSelect(address.id)}
										className={cn(
											"group relative flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors",
											isSelected
												? "bg-muted/30 border-foreground"
												: "hover:border-muted-foreground/50 border-border",
										)}
									>
										{/* Radio indicator */}
										<div
											className={cn(
												"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
												isSelected ? "border-foreground" : "border-muted-foreground/40",
											)}
										>
											{isSelected && <div className="h-2.5 w-2.5 rounded-full bg-foreground" />}
										</div>

										{/* Address content */}
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<span className="truncate font-medium">
													{address.firstName} {address.lastName}
												</span>
												{isDefault && (
													<span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
														Default
													</span>
												)}
											</div>
											<p className="mt-0.5 truncate text-sm text-muted-foreground">
												{address.streetAddress1}
											</p>
											<p className="truncate text-sm text-muted-foreground">
												{address.city}, {address.postalCode}
											</p>
										</div>

										{/* Edit button (appears on hover) */}
										{onEdit && (
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													onEdit(address.id);
													onOpenChange(false);
												}}
												className="shrink-0 rounded px-2 py-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
											>
												Edit
											</button>
										)}
									</button>
								);
							})}
						</div>
					)}
				</div>

				{/* Add new address button */}
				{onAddNew && (
					<div className="shrink-0 border-t px-4 py-3">
						<Button
							type="button"
							variant="outline-solid"
							className="w-full"
							onClick={() => {
								onAddNew();
								onOpenChange(false);
							}}
						>
							<Plus className="h-4 w-4" />
							Add new address
						</Button>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
};
