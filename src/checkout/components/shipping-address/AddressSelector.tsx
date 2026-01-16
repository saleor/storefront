"use client";

import { type FC, useState, useCallback } from "react";
import {
	type AddressFragment,
	type AddressTypeEnum,
	useUserSetDefaultAddressMutation,
} from "@/checkout/graphql";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/ui/components/ui/Checkbox";
import { Label } from "@/ui/components/ui/Label";
import { LoadingSpinner } from "@/checkout/ui-kit/LoadingSpinner";

export interface AddressSelectorProps {
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
	/** Called when edit is clicked on an address */
	onEdit?: (id: string) => void;
	/** Whether to show the "set as default" checkbox (default: true) */
	showSetAsDefault?: boolean;
}

/** Radio-button list for selecting from saved addresses. */
export const AddressSelector: FC<AddressSelectorProps> = ({
	addresses,
	selectedAddressId,
	onSelectAddress,
	defaultAddressId,
	emptyMessage = "You don't have any saved addresses yet.",
	name = "shippingAddress",
	addressType = "SHIPPING",
	onDefaultChange,
	onEdit,
	showSetAsDefault = true,
}) => {
	const [, setDefaultAddress] = useUserSetDefaultAddressMutation();
	const [isSettingDefault, setIsSettingDefault] = useState(false);
	const [setAsDefault, setSetAsDefault] = useState(false);

	// Reset "set as default" checkbox when selection changes
	const handleSelectAddress = useCallback(
		(id: string) => {
			onSelectAddress(id);
			setSetAsDefault(false);
		},
		[onSelectAddress],
	);

	// Handle the "set as default" checkbox change
	const handleSetAsDefaultChange = useCallback(
		async (checked: boolean) => {
			setSetAsDefault(checked);

			if (checked && selectedAddressId) {
				setIsSettingDefault(true);
				try {
					const result = await setDefaultAddress({
						id: selectedAddressId,
						type: addressType,
					});

					if (result.data?.accountSetDefaultAddress?.errors?.length) {
						// If there's an error, uncheck the box
						setSetAsDefault(false);
					} else {
						// Notify parent of the change
						onDefaultChange?.(selectedAddressId);
					}
				} catch {
					setSetAsDefault(false);
				} finally {
					setIsSettingDefault(false);
				}
			}
		},
		[selectedAddressId, setDefaultAddress, addressType, onDefaultChange],
	);

	if (addresses.length === 0) {
		return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
	}

	const shouldShowSetAsDefault =
		showSetAsDefault && selectedAddressId && selectedAddressId !== defaultAddressId;

	return (
		<div className="space-y-3">
			{addresses.map((address) => {
				const isSelected = selectedAddressId === address.id;
				const isDefault = defaultAddressId === address.id;

				return (
					<label
						key={address.id}
						className={cn(
							"flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors",
							"focus-within:ring-2 focus-within:ring-foreground focus-within:ring-offset-2",
							isSelected ? "bg-muted/30 border-foreground" : "hover:border-muted-foreground/50 border-border",
						)}
					>
						<input
							type="radio"
							name={name}
							value={address.id}
							checked={isSelected}
							onChange={() => handleSelectAddress(address.id)}
							className="sr-only"
						/>
						<div
							className={cn(
								"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
								isSelected ? "border-foreground" : "border-muted-foreground/50",
							)}
						>
							{isSelected && <div className="h-2.5 w-2.5 rounded-full bg-foreground" />}
						</div>
						<div className="flex-1 space-y-1">
							<div className="flex items-center gap-2">
								<span className="font-medium">
									{address.firstName} {address.lastName}
								</span>
								{isDefault && (
									<span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
										Default
									</span>
								)}
							</div>
							<p className="text-sm text-muted-foreground">
								{address.streetAddress1}
								{address.streetAddress2 && `, ${address.streetAddress2}`}
							</p>
							<p className="text-sm text-muted-foreground">
								{address.city}
								{address.countryArea && `, ${address.countryArea}`} {address.postalCode}
							</p>
							<p className="text-sm text-muted-foreground">{address.country?.country}</p>
						</div>
						{/* Edit button */}
						{onEdit && (
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onEdit(address.id);
								}}
								className="shrink-0 rounded px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								Edit
							</button>
						)}
					</label>
				);
			})}

			{/* Set as default checkbox - shown when a non-default address is selected */}
			{shouldShowSetAsDefault && (
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
		</div>
	);
};
