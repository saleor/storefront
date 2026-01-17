"use client";

import { type FC, useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Label } from "@/ui/components/ui/label";
import { Checkbox } from "@/ui/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { FormSelect, AddressFields } from "@/checkout/views/saleor-checkout/address-form-fields";
import { type CountryCode, type AddressFragment } from "@/checkout/graphql";
import { useAvailableShippingCountries } from "@/checkout/hooks/use-available-shipping-countries";
import { getCountryName } from "@/checkout/lib/utils/locale";
import { useAddressFormUtils } from "@/checkout/components/address-form/use-address-form-utils";
import { HybridAddressSelector } from "@/checkout/components/shipping-address";

export interface BillingAddressData {
	countryCode: CountryCode;
	formData: Record<string, string>;
	/** If set, use this saved address instead of formData */
	selectedAddressId?: string | null;
}

export interface BillingAddressSectionProps {
	/** Current billing address from checkout */
	billingAddress?: AddressFragment | null;
	/** Current shipping address (for "same as" option) */
	shippingAddress?: AddressFragment | null;
	/** User's saved addresses (for logged-in users) */
	userAddresses?: AddressFragment[];
	/** Default billing address ID (for "Default" badge) */
	defaultBillingAddressId?: string;
	/** Whether shipping is required (for digital products) */
	isShippingRequired?: boolean;
	/** Validation errors */
	errors?: Record<string, string>;
	/** Called when billing address data changes */
	onChange: (data: BillingAddressData) => void;
	/** Called when "same as shipping" changes */
	onSameAsShippingChange?: (sameAsShipping: boolean) => void;
	/** Initial "same as shipping" state */
	initialSameAsShipping?: boolean;
}

/**
 * Billing address section with "Same as shipping" toggle.
 *
 * Features:
 * - "Same as shipping address" checkbox (hidden for digital products)
 * - Saved address selection for logged-in users
 * - "Add new address" option
 * - Country-adaptive address fields
 * - Integrates with checkout address utils
 *
 * @example
 * ```tsx
 * <BillingAddressSection
 *   billingAddress={checkout.billingAddress}
 *   shippingAddress={checkout.shippingAddress}
 *   userAddresses={user?.addresses}
 *   defaultBillingAddressId={user?.defaultBillingAddress?.id}
 *   isShippingRequired={checkout.isShippingRequired}
 *   errors={errors}
 *   onChange={setBillingData}
 *   onSameAsShippingChange={setSameAsBilling}
 * />
 * ```
 */
export const BillingAddressSection: FC<BillingAddressSectionProps> = ({
	billingAddress,
	shippingAddress,
	userAddresses = [],
	defaultBillingAddressId,
	isShippingRequired = true,
	errors = {},
	onChange,
	onSameAsShippingChange,
	initialSameAsShipping,
}) => {
	const { availableShippingCountries } = useAvailableShippingCountries();

	const hasShippingAddress = !!shippingAddress;
	const hasSavedAddresses = userAddresses.length > 0;

	const [sameAsBilling, setSameAsBilling] = useState(
		initialSameAsShipping ?? (isShippingRequired && hasShippingAddress),
	);

	// For logged-in users: track whether to show saved addresses or new address form
	const [showNewAddressForm, setShowNewAddressForm] = useState(false);

	// Selected saved address ID (for logged-in users)
	const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
		// Default to the billing address if it matches a saved address, or the default billing address
		billingAddress?.id || defaultBillingAddressId || (userAddresses.length > 0 ? userAddresses[0].id : null),
	);

	const [countryCode, setCountryCode] = useState<CountryCode>(
		(billingAddress?.country?.code as CountryCode) || "US",
	);

	const [formData, setFormData] = useState<Record<string, string>>({
		firstName: billingAddress?.firstName || "",
		lastName: billingAddress?.lastName || "",
		streetAddress1: billingAddress?.streetAddress1 || "",
		streetAddress2: billingAddress?.streetAddress2 || "",
		companyName: billingAddress?.companyName || "",
		city: billingAddress?.city || "",
		postalCode: billingAddress?.postalCode || "",
		countryArea: billingAddress?.countryArea || "",
		phone: billingAddress?.phone || "",
	});

	const { orderedAddressFields, getFieldLabel, isRequiredField, countryAreaChoices } =
		useAddressFormUtils(countryCode);

	// Notify parent of changes
	useEffect(() => {
		// If using saved address, pass the selectedAddressId
		if (hasSavedAddresses && !showNewAddressForm && selectedAddressId) {
			onChange({ countryCode, formData, selectedAddressId });
		} else {
			onChange({ countryCode, formData, selectedAddressId: null });
		}
	}, [countryCode, formData, selectedAddressId, hasSavedAddresses, showNewAddressForm, onChange]);

	const handleSameAsShippingChange = (checked: boolean) => {
		setSameAsBilling(checked);
		onSameAsShippingChange?.(checked);
	};

	const handleSelectSavedAddress = (id: string) => {
		setSelectedAddressId(id);
		// Also populate formData from the selected address (for potential editing)
		const address = userAddresses.find((a) => a.id === id);
		if (address) {
			setCountryCode((address.country?.code as CountryCode) || "US");
			setFormData({
				firstName: address.firstName || "",
				lastName: address.lastName || "",
				streetAddress1: address.streetAddress1 || "",
				streetAddress2: address.streetAddress2 || "",
				companyName: address.companyName || "",
				city: address.city || "",
				postalCode: address.postalCode || "",
				countryArea: address.countryArea || "",
				phone: address.phone || "",
			});
		}
	};

	const updateField = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleCountryChange = (value: string) => {
		setCountryCode(value as CountryCode);
		setFormData((prev) => ({ ...prev, countryArea: "" }));
	};

	// Don't show form if same as shipping
	const showForm = !sameAsBilling || !hasShippingAddress;

	return (
		<section className="space-y-4">
			<h2 className="text-lg font-semibold">Billing address</h2>

			{/* Only show "Same as shipping" if there's a shipping address */}
			{hasShippingAddress && (
				<div className="flex items-center gap-3">
					<Checkbox
						id="same-billing"
						checked={sameAsBilling}
						onCheckedChange={(checked) => handleSameAsShippingChange(checked === true)}
					/>
					<Label htmlFor="same-billing" className="cursor-pointer text-sm">
						Same as shipping address
					</Label>
				</div>
			)}

			{/* Billing address form - shown when not same as shipping OR for digital products */}
			{showForm && (
				<div
					className={cn(
						"space-y-4 rounded-lg border border-border p-4",
						hasShippingAddress && "bg-secondary/30",
					)}
				>
					{/* For logged-in users with saved addresses */}
					{hasSavedAddresses ? (
						<>
							{showNewAddressForm ? (
								<>
									{/* Back to saved addresses */}
									<button
										type="button"
										onClick={() => setShowNewAddressForm(false)}
										className="mb-2 flex items-center gap-1 text-sm font-medium text-foreground underline underline-offset-2 hover:no-underline"
									>
										<ChevronLeft className="h-4 w-4" /> Back to saved addresses
									</button>

									{/* Country selector */}
									<div className="space-y-2">
										<Label htmlFor="billing-country" className="text-sm font-medium">
											Country/Region
										</Label>
										<FormSelect
											id="billing-country"
											value={countryCode}
											onChange={handleCountryChange}
											placeholder="Select country"
											autoComplete="country"
											options={availableShippingCountries.map((code) => ({
												value: code,
												label: getCountryName(code),
											}))}
										/>
									</div>

									{/* Dynamic address fields */}
									<AddressFields
										orderedFields={orderedAddressFields}
										getFieldLabel={getFieldLabel}
										isRequiredField={isRequiredField}
										formData={formData}
										errors={errors}
										onFieldChange={updateField}
										countryAreaChoices={countryAreaChoices}
										idPrefix="billing-"
									/>
								</>
							) : (
								<>
									{/* Saved address selector */}
									<HybridAddressSelector
										addresses={userAddresses}
										selectedAddressId={selectedAddressId}
										onSelectAddress={handleSelectSavedAddress}
										defaultAddressId={defaultBillingAddressId}
										emptyMessage="No saved addresses available."
										name="billingAddress"
										addressType="BILLING"
										sheetTitle="Select billing address"
										onAddNew={() => {
											setShowNewAddressForm(true);
											setSelectedAddressId(null);
											// Clear form for new entry
											setFormData({
												firstName: "",
												lastName: "",
												streetAddress1: "",
												streetAddress2: "",
												companyName: "",
												city: "",
												postalCode: "",
												countryArea: "",
												phone: "",
											});
										}}
									/>

									{errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
								</>
							)}
						</>
					) : (
						<>
							{/* Guest user: always show form */}
							{/* Country selector */}
							<div className="space-y-2">
								<Label htmlFor="billing-country" className="text-sm font-medium">
									Country/Region
								</Label>
								<FormSelect
									id="billing-country"
									value={countryCode}
									onChange={handleCountryChange}
									placeholder="Select country"
									autoComplete="country"
									options={availableShippingCountries.map((code) => ({
										value: code,
										label: getCountryName(code),
									}))}
								/>
							</div>

							{/* Dynamic address fields */}
							<AddressFields
								orderedFields={orderedAddressFields}
								getFieldLabel={getFieldLabel}
								isRequiredField={isRequiredField}
								formData={formData}
								errors={errors}
								onFieldChange={updateField}
								countryAreaChoices={countryAreaChoices}
								idPrefix="billing-"
							/>
						</>
					)}
				</div>
			)}
		</section>
	);
};

/**
 * Hook to get billing address validation info.
 */
export const useBillingAddressValidation = (countryCode: CountryCode) => {
	const { orderedAddressFields, getFieldLabel, isRequiredField } = useAddressFormUtils(countryCode);

	const validateBillingAddress = (formData: Record<string, string>): Record<string, string> => {
		const errors: Record<string, string> = {};
		orderedAddressFields.forEach((field) => {
			if (isRequiredField(field) && !formData[field]) {
				errors[field] = `${getFieldLabel(field)} is required`;
			}
		});
		return errors;
	};

	return { validateBillingAddress, orderedAddressFields, getFieldLabel, isRequiredField };
};
