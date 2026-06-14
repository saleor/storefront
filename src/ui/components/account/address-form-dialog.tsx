"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus, Pencil } from "lucide-react";
import { type AddressDetailsFragment } from "@/gql/graphql";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetCloseButton,
} from "@/ui/components/ui/sheet";
import { createAddress, updateAddress } from "@/app/(storefront)/[locale]/[channel]/(main)/account/actions";
import { resolveAccountActionError } from "@/ui/components/account/account-action-result";

type Props = {
	address?: AddressDetailsFragment;
};

export function AddressFormDialog({ address }: Props) {
	const t = useTranslations("account");
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState("");

	const isEditing = !!address;

	const handleSubmit = useCallback(
		(formData: FormData) => {
			setError("");
			const action = isEditing ? updateAddress : createAddress;

			startTransition(async () => {
				const result = await action(formData);
				if (!result.success) {
					setError(resolveAccountActionError(t, result));
				} else {
					setOpen(false);
					router.refresh();
				}
			});
		},
		[isEditing, router, startTransition, t],
	);

	return (
		<>
			{isEditing ? (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setOpen(true)}
					aria-label={t("addresses.editAddressAria")}
				>
					<Pencil className="h-3.5 w-3.5" />
				</Button>
			) : (
				<Button variant="outline-solid" size="sm" onClick={() => setOpen(true)}>
					<Plus className="mr-1 h-4 w-4" />
					{t("addresses.addAddress")}
				</Button>
			)}
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent side="right" className="overflow-y-auto p-6">
					<SheetHeader className="mb-6">
						<SheetTitle>{isEditing ? t("addresses.editAddress") : t("addresses.addNewAddress")}</SheetTitle>
						<SheetDescription className="sr-only">
							{isEditing ? t("addresses.editAddressDescription") : t("addresses.addAddressDescription")}
						</SheetDescription>
						<SheetCloseButton />
					</SheetHeader>

					<form action={handleSubmit} className="space-y-4">
						{isEditing && <input type="hidden" name="id" value={address.id} />}

						{error && (
							<p role="alert" className="text-sm text-destructive">
								{error}
							</p>
						)}

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label htmlFor="addr-firstName">{t("fields.firstName")}</Label>
								<Input
									id="addr-firstName"
									name="firstName"
									autoComplete="given-name"
									defaultValue={address?.firstName}
									required
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="addr-lastName">{t("fields.lastName")}</Label>
								<Input
									id="addr-lastName"
									name="lastName"
									autoComplete="family-name"
									defaultValue={address?.lastName}
									required
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="addr-companyName">{t("fields.companyOptional")}</Label>
							<Input
								id="addr-companyName"
								name="companyName"
								autoComplete="organization"
								defaultValue={address?.companyName}
							/>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="addr-streetAddress1">{t("fields.streetAddress")}</Label>
							<Input
								id="addr-streetAddress1"
								name="streetAddress1"
								autoComplete="address-line1"
								defaultValue={address?.streetAddress1}
								required
							/>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="addr-streetAddress2">{t("fields.streetAddress2Optional")}</Label>
							<Input
								id="addr-streetAddress2"
								name="streetAddress2"
								autoComplete="address-line2"
								defaultValue={address?.streetAddress2}
							/>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label htmlFor="addr-city">{t("fields.city")}</Label>
								<Input
									id="addr-city"
									name="city"
									autoComplete="address-level2"
									defaultValue={address?.city}
									required
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="addr-postalCode">{t("fields.postalCode")}</Label>
								<Input
									id="addr-postalCode"
									name="postalCode"
									autoComplete="postal-code"
									defaultValue={address?.postalCode}
									required
								/>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label htmlFor="addr-countryArea">{t("fields.stateProvince")}</Label>
								<Input
									id="addr-countryArea"
									name="countryArea"
									autoComplete="address-level1"
									defaultValue={address?.countryArea}
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="addr-country">{t("fields.countryCode")}</Label>
								<Input
									id="addr-country"
									name="country"
									autoComplete="country"
									defaultValue={address?.country.code}
									placeholder={t("placeholders.countryCode")}
									maxLength={2}
									required
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="addr-phone">{t("fields.phoneOptional")}</Label>
							<Input
								id="addr-phone"
								name="phone"
								type="tel"
								autoComplete="tel"
								defaultValue={address?.phone ?? ""}
							/>
						</div>

						<div className="flex gap-2 pt-2">
							<Button type="submit" disabled={isPending} className="flex-1">
								{isPending
									? t("common.saving")
									: isEditing
										? t("addresses.updateAddress")
										: t("addresses.addAddress")}
							</Button>
						</div>
					</form>
				</SheetContent>
			</Sheet>
		</>
	);
}
