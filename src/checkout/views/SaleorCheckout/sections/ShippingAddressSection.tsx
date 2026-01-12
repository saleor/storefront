"use client";

import { type FC } from "react";
import { Label } from "@/ui/components/ui/Label";
import { FormSelect, FieldError, AddressFields } from "../AddressFormFields";
import { HybridAddressSelector } from "@/checkout/components/shipping-address";
import { getCountryName } from "@/checkout/lib/utils/locale";
import type { CountryCode, AddressFragment } from "@/checkout/graphql";
import type { AddressField } from "@/checkout/components/AddressForm/types";

// =============================================================================
// Types
// =============================================================================

interface ShippingAddressSectionProps {
	// Auth state
	isAuthenticated: boolean;
	userAddresses: AddressFragment[];
	defaultAddressId?: string;

	// Address selection (logged-in users)
	selectedAddressId: string | null;
	onSelectAddress: (id: string | null) => void;
	showNewAddressForm: boolean;
	onShowNewAddressForm: (show: boolean) => void;

	// Address form (guests/new address)
	countryCode: CountryCode;
	onCountryChange: (code: string) => void;
	availableCountries: CountryCode[];
	formData: Record<string, string>;
	onFieldChange: (field: string, value: string) => void;
	errors: Record<string, string>;

	// Address field configuration (from useAddressFormUtils)
	orderedAddressFields: AddressField[];
	getFieldLabel: (field: AddressField) => string;
	isRequiredField: (field: AddressField) => boolean;
	countryAreaChoices?: Array<{ raw?: unknown; verbose?: unknown }>;
}

// =============================================================================
// Component
// =============================================================================

export const ShippingAddressSection: FC<ShippingAddressSectionProps> = ({
	isAuthenticated,
	userAddresses,
	defaultAddressId,
	selectedAddressId,
	onSelectAddress,
	showNewAddressForm,
	onShowNewAddressForm,
	countryCode,
	onCountryChange,
	availableCountries,
	formData,
	onFieldChange,
	errors,
	orderedAddressFields,
	getFieldLabel,
	isRequiredField,
	countryAreaChoices,
}) => {
	const hasAddresses = userAddresses.length > 0;
	const showAddressList = isAuthenticated && hasAddresses && !showNewAddressForm;

	return (
		<section className="space-y-4">
			<h2 className="text-xl font-semibold">Shipping address</h2>

			{showAddressList ? (
				<>
					<HybridAddressSelector
						addresses={userAddresses}
						selectedAddressId={selectedAddressId}
						onSelectAddress={onSelectAddress}
						defaultAddressId={defaultAddressId}
						emptyMessage="You don't have any saved addresses yet. Please enter your shipping address below."
						addressType="SHIPPING"
						sheetTitle="Select shipping address"
						onAddNew={() => onShowNewAddressForm(true)}
					/>
					{errors.address && <FieldError error={errors.address} />}
				</>
			) : (
				<>
					{/* Back to saved addresses link (for logged-in users) */}
					{isAuthenticated && hasAddresses && showNewAddressForm && (
						<button
							type="button"
							onClick={() => onShowNewAddressForm(false)}
							className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline"
						>
							← Back to saved addresses
						</button>
					)}

					{/* Country selector */}
					<div className="space-y-2">
						<Label htmlFor="country" className="text-sm font-medium">
							Country/Region
						</Label>
						<FormSelect
							id="country"
							value={countryCode}
							onChange={onCountryChange}
							placeholder="Select country"
							autoComplete="country"
							options={availableCountries.map((code) => ({
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
						onFieldChange={onFieldChange}
						countryAreaChoices={countryAreaChoices}
					/>
				</>
			)}
		</section>
	);
};
