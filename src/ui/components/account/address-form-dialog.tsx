"use client";

import { useState, useTransition, useCallback } from "react";
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
import { createAddress, updateAddress } from "@/app/[channel]/(main)/account/actions";

type Props = {
	address?: AddressDetailsFragment;
};

export function AddressFormDialog({ address }: Props) {
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
					setError(result.error);
				} else {
					setOpen(false);
				}
			});
		},
		[isEditing, startTransition],
	);

	return (
		<>
			{isEditing ? (
				<Button variant="ghost" size="sm" onClick={() => setOpen(true)} aria-label="Edit address">
					<Pencil className="h-3.5 w-3.5" />
				</Button>
			) : (
				<Button variant="outline-solid" size="sm" onClick={() => setOpen(true)}>
					<Plus className="mr-1 h-4 w-4" />
					Add address
				</Button>
			)}
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent side="right" className="overflow-y-auto p-6">
					<SheetHeader className="mb-6">
						<SheetTitle>{isEditing ? "Edit address" : "Add new address"}</SheetTitle>
						<SheetDescription className="sr-only">
							{isEditing ? "Update your address details" : "Add a new address to your account"}
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
								<Label htmlFor="addr-firstName">First name</Label>
								<Input
									id="addr-firstName"
									name="firstName"
									autoComplete="given-name"
									defaultValue={address?.firstName}
									required
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="addr-lastName">Last name</Label>
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
							<Label htmlFor="addr-companyName">Company (optional)</Label>
							<Input
								id="addr-companyName"
								name="companyName"
								autoComplete="organization"
								defaultValue={address?.companyName}
							/>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="addr-streetAddress1">Street address</Label>
							<Input
								id="addr-streetAddress1"
								name="streetAddress1"
								autoComplete="address-line1"
								defaultValue={address?.streetAddress1}
								required
							/>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="addr-streetAddress2">Apt, suite, etc. (optional)</Label>
							<Input
								id="addr-streetAddress2"
								name="streetAddress2"
								autoComplete="address-line2"
								defaultValue={address?.streetAddress2}
							/>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label htmlFor="addr-city">City</Label>
								<Input
									id="addr-city"
									name="city"
									autoComplete="address-level2"
									defaultValue={address?.city}
									required
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="addr-postalCode">Postal code</Label>
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
								<Label htmlFor="addr-countryArea">State / Province</Label>
								<Input
									id="addr-countryArea"
									name="countryArea"
									autoComplete="address-level1"
									defaultValue={address?.countryArea}
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="addr-country">Country code</Label>
								<Input
									id="addr-country"
									name="country"
									autoComplete="country"
									defaultValue={address?.country.code}
									placeholder="US"
									maxLength={2}
									required
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="addr-phone">Phone (optional)</Label>
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
								{isPending ? "Saving…" : isEditing ? "Update address" : "Add address"}
							</Button>
						</div>
					</form>
				</SheetContent>
			</Sheet>
		</>
	);
}
