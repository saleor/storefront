"use client";

import { useState, useMemo } from "react";
import { type AddressFragment, type CountryCode, useUserAddressCreateMutation, useUserAddressUpdateMutation, useUserAddressDeleteMutation } from "@/checkout/graphql";
import { useRouter } from "next/navigation";
import { countries as allCountries } from "@/checkout/lib/consts/countries";
import { getCountryName } from "@/checkout/lib/utils/locale";

interface SimpleAddressFormProps {
	mode: "create" | "edit";
	address?: AddressFragment | null;
	onClose: () => void;
	onSuccess: (address: AddressFragment) => void;
	onDelete?: (id: string) => void;
}

export function SimpleAddressForm({ mode, address, onClose, onSuccess, onDelete }: SimpleAddressFormProps) {
	const router = useRouter();
	const [, createAddress] = useUserAddressCreateMutation();
	const [, updateAddress] = useUserAddressUpdateMutation();
	const [, deleteAddress] = useUserAddressDeleteMutation();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<string[]>([]);

	// Generate country options with proper names
	const countryOptions = useMemo(() => {
		return allCountries.map((countryCode) => ({
			code: countryCode,
			name: getCountryName(countryCode),
		})).sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors([]);
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const addressInput = {
			firstName: formData.get("firstName")?.toString() || "",
			lastName: formData.get("lastName")?.toString() || "",
			streetAddress1: formData.get("streetAddress1")?.toString() || "",
			streetAddress2: formData.get("streetAddress2")?.toString() || "",
			city: formData.get("city")?.toString() || "",
			cityArea: formData.get("cityArea")?.toString() || "",
			postalCode: formData.get("postalCode")?.toString() || "",
			countryArea: formData.get("countryArea")?.toString() || "",
			country: (formData.get("country")?.toString() || "US") as CountryCode,
			phone: formData.get("phone")?.toString() || "",
			companyName: formData.get("companyName")?.toString() || "",
		};

		try {
			if (mode === "create") {
				const result = await createAddress({ address: addressInput });
				if (result.data?.accountAddressCreate?.errors?.length) {
					setErrors(result.data.accountAddressCreate.errors.map((e) => e.message || "Error"));
				} else if (result.data?.accountAddressCreate?.address) {
					onSuccess(result.data.accountAddressCreate.address as AddressFragment);
					router.refresh();
					onClose();
				}
			} else if (address) {
				const result = await updateAddress({ id: address.id, address: addressInput });
				if (result.data?.accountAddressUpdate?.errors?.length) {
					setErrors(result.data.accountAddressUpdate.errors.map((e) => e.message || "Error"));
				} else if (result.data?.accountAddressUpdate?.address) {
					onSuccess(result.data.accountAddressUpdate.address as AddressFragment);
					router.refresh();
					onClose();
				}
			}
		} catch (error) {
			console.error("Address operation error:", error);
			setErrors(["Failed to save address. Please try again."]);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!address || !onDelete) return;
		
		if (!confirm("Are you sure you want to delete this address?")) {
			return;
		}

		setLoading(true);
		try {
			const result = await deleteAddress({ id: address.id });
			if (result.data?.accountAddressDelete?.errors?.length) {
				setErrors(result.data.accountAddressDelete.errors.map((e) => e.message || "Error"));
			} else {
				onDelete(address.id);
				router.refresh();
				onClose();
			}
		} catch (error) {
			console.error("Delete error:", error);
			setErrors(["Failed to delete address."]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{errors.length > 0 && (
				<div className="rounded-md bg-red-50 border border-red-200 p-4">
					{errors.map((error, idx) => (
						<p key={idx} className="text-sm text-red-800">{error}</p>
					))}
				</div>
			)}

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-neutral-700 mb-1">
						First Name
					</label>
					<input
						type="text"
						name="firstName"
						defaultValue={address?.firstName || ""}
						className="input"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-neutral-700 mb-1">
						Last Name
					</label>
					<input
						type="text"
						name="lastName"
						defaultValue={address?.lastName || ""}
						className="input"
						required
					/>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-neutral-700 mb-1">
					Street Address
				</label>
				<input
					type="text"
					name="streetAddress1"
					defaultValue={address?.streetAddress1 || ""}
					className="input"
					required
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-neutral-700 mb-1">
					Apartment, suite, etc. (optional)
				</label>
				<input
					type="text"
					name="streetAddress2"
					defaultValue={address?.streetAddress2 || ""}
					className="input"
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-neutral-700 mb-1">
						City
					</label>
					<input
						type="text"
						name="city"
						defaultValue={address?.city || ""}
						className="input"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-neutral-700 mb-1">
						State/Province (optional)
					</label>
					<input
						type="text"
						name="countryArea"
						defaultValue={address?.countryArea || ""}
						className="input"
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-neutral-700 mb-1">
						Postal Code
					</label>
					<input
						type="text"
						name="postalCode"
						defaultValue={address?.postalCode || ""}
						className="input"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-neutral-700 mb-1">
						Country
					</label>
					<select
						name="country"
						defaultValue={address?.country.code || "US"}
						className="input"
						required
					>
						{countryOptions.map(({ code, name }) => (
							<option key={code} value={code}>
								{name}
							</option>
						))}
					</select>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-neutral-700 mb-1">
					Phone (optional)
				</label>
				<input
					type="tel"
					name="phone"
					defaultValue={address?.phone || ""}
					className="input"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-neutral-700 mb-1">
					Company (optional)
				</label>
				<input
					type="text"
					name="companyName"
					defaultValue={address?.companyName || ""}
					className="input"
				/>
			</div>

			<div className="flex gap-3 pt-4">
				<button
					type="submit"
					disabled={loading}
					className="btn-primary flex-1"
				>
					{loading ? "Saving..." : mode === "create" ? "Add Address" : "Update Address"}
				</button>
				<button
					type="button"
					onClick={onClose}
					disabled={loading}
					className="btn-secondary px-6"
				>
					Cancel
				</button>
				{mode === "edit" && onDelete && (
					<button
						type="button"
						onClick={handleDelete}
						disabled={loading}
						className="btn-secondary px-6 text-red-600 hover:bg-red-50"
					>
						Delete
					</button>
				)}
			</div>
		</form>
	);
}
