"use client";

import { type FC } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { type AddressFragment } from "@/checkout/graphql";
import { cn } from "@/lib/utils";

export interface AddressCardProps {
	/** The address to display */
	address: AddressFragment;
	/** Whether this is the selected address */
	isSelected?: boolean;
	/** Whether this is the default address */
	isDefault?: boolean;
	/** Called when the card is clicked */
	onClick?: () => void;
	/** Called when "Change" is clicked */
	onChangeClick?: () => void;
	/** Compact mode shows less detail */
	compact?: boolean;
	/** Additional class names */
	className?: string;
	/** Non-interactive display (e.g. "same as shipping" preview) */
	disabled?: boolean;
}

/**
 * Compact address card showing address preview.
 * Used as the collapsed state when there are many addresses.
 */
export const AddressCard: FC<AddressCardProps> = ({
	address,
	isSelected = false,
	isDefault = false,
	onClick,
	onChangeClick,
	compact = false,
	className,
	disabled = false,
}) => {
	const tAddresses = useTranslations("checkout.addresses");
	const tCommon = useTranslations("account.common");

	const handleChangeClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onChangeClick?.();
	};

	return (
		<div
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
			onClick={onClick}
			onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
			className={cn(
				"relative flex items-start gap-3 rounded-lg border p-4 transition-colors",
				onClick && !disabled && "hover:border-muted-foreground/50 cursor-pointer",
				isSelected && "bg-muted/30 border-foreground",
				!isSelected && "border-border",
				disabled && "bg-muted/20 pointer-events-none opacity-70",
				className,
			)}
		>
			<div className="min-w-0 flex-1">
				<div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
					<span className="font-medium">
						{address.firstName} {address.lastName}
					</span>
					{isDefault && (
						<span className="w-fit rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
							{tAddresses("defaultBadge")}
						</span>
					)}
				</div>

				{compact ? (
					<p className="mt-0.5 truncate text-sm text-muted-foreground">
						{address.streetAddress1}, {address.city} {address.postalCode}
					</p>
				) : (
					<>
						<p className="mt-0.5 text-sm text-muted-foreground">
							{address.streetAddress1}
							{address.streetAddress2 && `, ${address.streetAddress2}`}
						</p>
						<p className="text-sm text-muted-foreground">
							{address.city}
							{address.countryArea && `, ${address.countryArea}`} {address.postalCode}
						</p>
						<p className="text-sm text-muted-foreground">{address.country?.country}</p>
					</>
				)}
			</div>

			{/* Change button */}
			{onChangeClick && (
				<button
					type="button"
					onClick={handleChangeClick}
					className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				>
					{tCommon("change")}
					<ChevronRight className="h-4 w-4" />
				</button>
			)}
		</div>
	);
};
