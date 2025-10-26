"use client";

import { useState } from "react";
import { type AddressFragment } from "@/checkout/graphql";
import { AddressCard } from "./AddressCard";
import { AddressDialog } from "./AddressDialog";
import { Plus } from "lucide-react";

interface Address {
	id: string;
	city?: string | null;
	phone?: string | null;
	postalCode: string;
	companyName?: string | null;
	cityArea?: string | null;
	streetAddress1: string;
	streetAddress2?: string | null;
	countryArea?: string | null;
	country: {
		country: string;
		code: string;
	};
	firstName?: string | null;
	lastName?: string | null;
}

interface AddressManagementProps {
	initialUser: {
		addresses?: Array<Address> | null;
		defaultShippingAddress?: { id: string } | null;
		defaultBillingAddress?: { id: string } | null;
	};
}

type DialogMode = "create" | "edit" | null;

export function AddressManagement({ initialUser }: AddressManagementProps) {
	const [addresses, setAddresses] = useState<AddressFragment[]>(
		(initialUser.addresses as AddressFragment[]) || []
	);
	const [defaultShippingId, setDefaultShippingId] = useState(initialUser.defaultShippingAddress?.id);
	const [defaultBillingId, setDefaultBillingId] = useState(initialUser.defaultBillingAddress?.id);
	const [dialogMode, setDialogMode] = useState<DialogMode>(null);
	const [selectedAddress, setSelectedAddress] = useState<AddressFragment | null>(null);

	const handleAddAddress = () => {
		setSelectedAddress(null);
		setDialogMode("create");
	};

	const handleEditAddress = (address: AddressFragment) => {
		setSelectedAddress(address);
		setDialogMode("edit");
	};

	const handleAddressCreated = (address: AddressFragment) => {
		setAddresses([...addresses, address]);
	};

	const handleAddressUpdated = (address: AddressFragment) => {
		setAddresses(addresses.map((addr) => (addr.id === address.id ? address : addr)));
	};

	const handleAddressDeleted = (id: string) => {
		setAddresses(addresses.filter((addr) => addr.id !== id));
		if (defaultShippingId === id) {
			setDefaultShippingId(undefined);
		}
		if (defaultBillingId === id) {
			setDefaultBillingId(undefined);
		}
	};

	return (
		<div>
			<div className="mb-6">
				<button
					onClick={handleAddAddress}
					className="btn-primary inline-flex items-center gap-2"
				>
					<Plus className="h-4 w-4" />
					Add New Address
				</button>
			</div>

			{addresses.length === 0 ? (
				<div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
					<p className="text-neutral-600">You don&apos;t have any saved addresses yet.</p>
					<p className="mt-2 text-sm text-neutral-500">
						Add an address to speed up checkout in the future.
					</p>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{addresses.map((address) => (
						<AddressCard
							key={address.id}
							address={address}
							isDefaultShipping={address.id === defaultShippingId}
							isDefaultBilling={address.id === defaultBillingId}
							onEdit={() => handleEditAddress(address)}
						/>
					))}
				</div>
			)}

			{dialogMode && (
				<AddressDialog
					mode={dialogMode}
					address={selectedAddress}
					onClose={() => {
						setDialogMode(null);
						setSelectedAddress(null);
					}}
					onAddressCreated={handleAddressCreated}
					onAddressUpdated={handleAddressUpdated}
					onAddressDeleted={handleAddressDeleted}
				/>
			)}
		</div>
	);
}
