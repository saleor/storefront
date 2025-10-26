"use client";

import { type AddressFragment } from "@/checkout/graphql";
import { Edit, MapPin } from "lucide-react";

interface AddressCardProps {
	address: AddressFragment;
	isDefaultShipping?: boolean;
	isDefaultBilling?: boolean;
	onEdit: () => void;
}

export function AddressCard({ address, isDefaultShipping, isDefaultBilling, onEdit }: AddressCardProps) {
	return (
		<div className="group relative rounded-lg border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-md">
			<div className="mb-4 flex items-start justify-between">
				<div className="flex items-center gap-2">
					<MapPin className="h-5 w-5 text-neutral-400" />
					<div className="flex flex-wrap gap-2">
						{isDefaultShipping && (
							<span className="rounded bg-accent-100 px-2 py-1 text-xs font-medium text-accent-700">
								Default Shipping
							</span>
						)}
						{isDefaultBilling && (
							<span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
								Default Billing
							</span>
						)}
					</div>
				</div>
				<button
					onClick={onEdit}
					className="rounded p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
					aria-label="Edit address"
				>
					<Edit className="h-4 w-4" />
				</button>
			</div>

			<div className="space-y-1 text-sm text-neutral-700">
				{address.firstName || address.lastName ? (
					<p className="font-medium text-neutral-900">
						{address.firstName} {address.lastName}
					</p>
				) : null}
				{address.companyName && <p>{address.companyName}</p>}
				<p>{address.streetAddress1}</p>
				{address.streetAddress2 && <p>{address.streetAddress2}</p>}
				<p>
					{address.city}
					{address.cityArea && `, ${address.cityArea}`}
					{address.postalCode && ` ${address.postalCode}`}
				</p>
				{address.countryArea && <p>{address.countryArea}</p>}
				<p className="font-medium">{address.country.country}</p>
				{address.phone && <p className="mt-2">Phone: {address.phone}</p>}
			</div>
		</div>
	);
}
