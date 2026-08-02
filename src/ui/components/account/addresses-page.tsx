"use client";

import { useTranslations } from "next-intl";
import { AccountAddressCard } from "@/ui/components/account/address-card";
import { AddressFormDialog } from "@/ui/components/account/address-form-dialog";
import { DeleteAddressButton, SetDefaultAddressButton } from "@/ui/components/account/address-actions";
import { useAccountUser } from "@/ui/components/account/account-context";

export function AddressesPage() {
	const t = useTranslations("account.addresses");
	const user = useAccountUser();
	const { addresses } = user;
	const defaultShippingId = user.defaultShippingAddress?.id;
	const defaultBillingId = user.defaultBillingAddress?.id;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-balance text-h1">{t("title")}</h1>
					<p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
				</div>
				<AddressFormDialog />
			</div>

			{addresses.length === 0 ? (
				<div className="rounded-lg border border-dashed p-8 text-center">
					<p className="text-muted-foreground">{t("empty")}</p>
					<div className="mt-4">
						<AddressFormDialog />
					</div>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2">
					{addresses.map((address) => {
						const isDefaultShipping = address.id === defaultShippingId;
						const isDefaultBilling = address.id === defaultBillingId;

						const showDefaultLinks = !isDefaultShipping || !isDefaultBilling;

						return (
							<AccountAddressCard
								key={address.id}
								address={address}
								isDefaultShipping={isDefaultShipping}
								isDefaultBilling={isDefaultBilling}
								footer={
									showDefaultLinks ? (
										<>
											{!isDefaultShipping && (
												<SetDefaultAddressButton addressId={address.id} type="SHIPPING" />
											)}
											{!isDefaultBilling && <SetDefaultAddressButton addressId={address.id} type="BILLING" />}
										</>
									) : undefined
								}
							>
								<AddressFormDialog address={address} />
								<DeleteAddressButton addressId={address.id} />
							</AccountAddressCard>
						);
					})}
				</div>
			)}
		</div>
	);
}
