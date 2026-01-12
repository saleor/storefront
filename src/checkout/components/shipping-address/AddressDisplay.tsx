"use client";

import { type FC } from "react";
import { type AddressFragment } from "@/checkout/graphql";
import { cn } from "@/lib/utils";

export interface AddressDisplayProps {
	/** Address to display */
	address: AddressFragment | null | undefined;
	/** Optional title (e.g., "Shipping address") */
	title?: string;
	/** Additional CSS classes */
	className?: string;
	/** Show "Edit" button */
	onEdit?: () => void;
}

/**
 * Read-only display of an address.
 *
 * Use cases:
 * - Order confirmation
 * - Checkout review step
 * - Account address list
 *
 * @example
 * ```tsx
 * <AddressDisplay
 *   title="Shipping address"
 *   address={checkout.shippingAddress}
 *   onEdit={() => setStep("information")}
 * />
 * ```
 */
export const AddressDisplay: FC<AddressDisplayProps> = ({ address, title, className, onEdit }) => {
	if (!address) {
		return (
			<div className={cn("text-sm text-muted-foreground", className)}>
				{title && <p className="mb-1 font-medium text-foreground">{title}</p>}
				<p>No address provided</p>
			</div>
		);
	}

	return (
		<div className={cn("text-sm", className)}>
			{(title || onEdit) && (
				<div className="mb-1 flex items-center justify-between">
					{title && <p className="font-medium text-foreground">{title}</p>}
					{onEdit && (
						<button
							type="button"
							onClick={onEdit}
							className="text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline"
						>
							Edit
						</button>
					)}
				</div>
			)}
			<div className="space-y-0.5 text-muted-foreground">
				<p className="font-medium text-foreground">
					{address.firstName} {address.lastName}
				</p>
				{address.companyName && <p>{address.companyName}</p>}
				<p>{address.streetAddress1}</p>
				{address.streetAddress2 && <p>{address.streetAddress2}</p>}
				<p>
					{address.city}
					{address.countryArea && `, ${address.countryArea}`} {address.postalCode}
				</p>
				<p>{address.country?.country}</p>
				{address.phone && <p>{address.phone}</p>}
			</div>
		</div>
	);
};
