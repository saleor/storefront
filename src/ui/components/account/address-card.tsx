"use client";

import { useTranslations } from "next-intl";
import { type AddressDetailsFragment } from "@/gql/graphql";
import { cn } from "@/lib/utils";

type Props = {
	address: AddressDetailsFragment;
	isDefaultShipping?: boolean;
	isDefaultBilling?: boolean;
	className?: string;
	children?: React.ReactNode;
	footer?: React.ReactNode;
};

export function AccountAddressCard({
	address,
	isDefaultShipping,
	isDefaultBilling,
	className,
	children,
	footer,
}: Props) {
	const t = useTranslations("account.addresses");

	return (
		<div className={cn("flex h-full flex-col rounded-lg border p-4", className)}>
			<div className="flex flex-1 items-start justify-between gap-4">
				<div className="min-w-0 flex-1 space-y-1">
					<div className="flex flex-wrap items-center gap-2">
						<span className="font-semibold">
							{address.firstName} {address.lastName}
						</span>
						{isDefaultShipping && (
							<span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
								{t("defaultShipping")}
							</span>
						)}
						{isDefaultBilling && (
							<span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
								{t("defaultBilling")}
							</span>
						)}
					</div>
					<p className="text-sm text-muted-foreground">{address.streetAddress1}</p>
					{address.streetAddress2 && (
						<p className="text-sm text-muted-foreground">{address.streetAddress2}</p>
					)}
					<p className="text-sm text-muted-foreground">
						{address.city}
						{address.countryArea && `, ${address.countryArea}`} {address.postalCode}
					</p>
					<p className="text-sm text-muted-foreground">{address.country.country}</p>
					{address.phone && <p className="mt-2 text-sm text-muted-foreground">{address.phone}</p>}
				</div>
				{children && <div className="flex shrink-0 items-center gap-1">{children}</div>}
			</div>
			{footer && (
				<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3">
					{footer}
				</div>
			)}
		</div>
	);
}
