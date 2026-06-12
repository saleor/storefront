"use client";

import { type FC, useState, useCallback } from "react";

import { setUserDefaultAddress } from "@/app/(checkout)/actions";
import { useRefreshCheckoutRsc } from "@/checkout/hooks/use-refresh-checkout-rsc";
import { type AddressFragment, type AddressTypeEnum } from "@/checkout/graphql";
import { Plus } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { Checkbox } from "@/ui/components/ui/checkbox";
import { Label } from "@/ui/components/ui/label";
import { LoadingSpinner } from "@/checkout/ui-kit/loading-spinner";
import { AddressCard } from "./address-card";
import { AddressPickerSheet } from "./address-picker-sheet";
import { AddressSelector } from "./address-selector";

/** Number of addresses before switching to collapsed mode */
const INLINE_THRESHOLD = 3;

export interface HybridAddressSelectorProps {
	/** List of saved addresses to choose from */
	addresses: AddressFragment[];
	/** Currently selected address ID */
	selectedAddressId: string | null;
	/** Called when an address is selected */
	onSelectAddress: (id: string) => void;
	/** Default address ID (shows "Default" badge) */
	defaultAddressId?: string;
	/** Empty state message */
	emptyMessage?: string;
	/** Name for radio group (defaults to "shippingAddress") */
	name?: string;
	/** Address type for setting default (SHIPPING or BILLING) */
	addressType?: AddressTypeEnum;
	/** Called when default address changes */
	onDefaultChange?: (newDefaultId: string) => void;
	/** Called when "Add new address" is clicked */
	onAddNew?: () => void;
	/** Called when edit is clicked on an address */
	onEdit?: (id: string) => void;
	/** Title for the sheet (many addresses mode) */
	sheetTitle?: string;
}

/** Adapts based on count: inline radio cards (≤3) or collapsed with sheet (4+). */
export const HybridAddressSelector: FC<HybridAddressSelectorProps> = ({
	addresses,
	selectedAddressId,
	onSelectAddress,
	defaultAddressId,
	emptyMessage = "You don't have any saved addresses yet.",
	name = "shippingAddress",
	addressType = "SHIPPING",
	onDefaultChange,
	onAddNew,
	onEdit,
	sheetTitle = "Select address",
}) => {
	const [sheetOpen, setSheetOpen] = useState(false);

	// For collapsed mode: manage "set as default" state here
	const refreshCheckoutRsc = useRefreshCheckoutRsc();
	const [isSettingDefault, setIsSettingDefault] = useState(false);
	const [setAsDefault, setSetAsDefault] = useState(false);

	// Get the selected address object
	const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

	// Determine which mode to use
	const useManyMode = addresses.length > INLINE_THRESHOLD;

	// Reset "set as default" checkbox when selection changes
	const handleSelectAddress = useCallback(
		(id: string) => {
			onSelectAddress(id);
			setSetAsDefault(false);
		},
		[onSelectAddress],
	);

	// Handle the "set as default" checkbox change (for collapsed mode)
	const handleSetAsDefaultChange = useCallback(
		async (checked: boolean) => {
			setSetAsDefault(checked);

			if (checked && selectedAddressId) {
				setIsSettingDefault(true);
				try {
					const result = await setUserDefaultAddress(selectedAddressId, addressType);

					if (!result.ok) {
						setSetAsDefault(false);
					} else {
						onDefaultChange?.(selectedAddressId);
						refreshCheckoutRsc();
					}
				} catch {
					setSetAsDefault(false);
				} finally {
					setIsSettingDefault(false);
				}
			}
		},
		[addressType, onDefaultChange, refreshCheckoutRsc, selectedAddressId],
	);

	// Empty state
	if (addresses.length === 0) {
		return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
	}

	// Inline mode: delegate to AddressSelector
	if (!useManyMode) {
		return (
			<AddressSelector
				addresses={addresses}
				selectedAddressId={selectedAddressId}
				onSelectAddress={onSelectAddress}
				defaultAddressId={defaultAddressId}
				emptyMessage={emptyMessage}
				name={name}
				addressType={addressType}
				onDefaultChange={onDefaultChange}
				onEdit={onEdit}
				onAddNew={onAddNew}
			/>
		);
	}

	// Collapsed mode: show selected address card + sheet
	const showSetAsDefault = selectedAddressId && selectedAddressId !== defaultAddressId;

	return (
		<div className="space-y-3">
			{/* Selected address card */}
			{selectedAddress ? (
				<AddressCard
					address={selectedAddress}
					isSelected
					isDefault={selectedAddress.id === defaultAddressId}
					onChangeClick={() => setSheetOpen(true)}
				/>
			) : (
				<button
					type="button"
					onClick={() => setSheetOpen(true)}
					className="border-muted-foreground/50 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
				>
					Select an address
				</button>
			)}

			{/* Address picker sheet */}
			<AddressPickerSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				addresses={addresses}
				selectedAddressId={selectedAddressId}
				onSelectAddress={handleSelectAddress}
				defaultAddressId={defaultAddressId}
				title={sheetTitle}
				onAddNew={onAddNew}
				onEdit={onEdit}
				addressType={addressType}
			/>

			{/* Set as default checkbox */}
			{showSetAsDefault && (
				<div className="flex items-center gap-3 pt-1">
					<Checkbox
						id={`${name}-setDefault`}
						checked={setAsDefault}
						onCheckedChange={(checked) => handleSetAsDefaultChange(checked === true)}
						disabled={isSettingDefault}
					/>
					<Label
						htmlFor={`${name}-setDefault`}
						className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"
					>
						{isSettingDefault && <LoadingSpinner />}
						Set as my default {addressType === "SHIPPING" ? "shipping" : "billing"} address
					</Label>
				</div>
			)}

			{onAddNew && (
				<Button type="button" variant="outline-solid" className="w-full" onClick={onAddNew}>
					<Plus className="h-4 w-4" />
					Add new address
				</Button>
			)}
		</div>
	);
};
