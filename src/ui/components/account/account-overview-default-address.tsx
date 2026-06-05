"use client";

import { ChevronRight } from "lucide-react";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { AccountAddressCard } from "@/ui/components/account/address-card";
import { accountRoutes } from "@/ui/components/account/routes";
import { useAccountUser } from "@/ui/components/account/account-context";

export function AccountOverviewDefaultAddress() {
	const user = useAccountUser();
	const defaultAddress =
		user.addresses.find((a) => a.id === user.defaultShippingAddress?.id) ?? user.addresses[0] ?? null;

	return (
		<section>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-semibold">Default Address</h2>
				<LinkWithChannel
					href={accountRoutes.addresses}
					className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
				>
					Manage
					<ChevronRight className="h-4 w-4" />
				</LinkWithChannel>
			</div>

			{defaultAddress ? (
				<AccountAddressCard address={defaultAddress} isDefaultShipping />
			) : (
				<div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
					No addresses saved yet.
				</div>
			)}
		</section>
	);
}
