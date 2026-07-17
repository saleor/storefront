"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/ui/components/ui/label";
import { FormSelect, FieldError, AddressFields } from "../address-form-fields";
import { HybridAddressSelector } from "@/checkout/components/shipping-address";
import type { ShippingCountryOption } from "@/checkout/lib/checkout-types";
import type { CountryCode, AddressFragment } from "@/checkout/graphql";
import type { AddressField } from "@/checkout/components/address-form/types";

// =============================================================================
// Types
// =============================================================================

interface ShippingAddressSectionProps {
	/** True while session refresh is in flight after sign-in (avoids guest form flash) */
	isLoading?: boolean;

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
	availableCountries: ShippingCountryOption[];
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
	isLoading = false,
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
	const t = useTranslations("checkout.shipping");
	const hasAddresses = userAddresses.length > 0;
	const showAddressList = isAuthenticated && hasAddresses && !showNewAddressForm;

	if (isLoading) {
		return (
			<section className="space-y-4">
				<div className="h-7 w-40 animate-pulse rounded bg-muted" />
				<div className="h-24 animate-pulse rounded-lg bg-muted" />
			</section>
		);
	}

	return (
		<section className="space-y-4">
			<h2 className="text-xl font-semibold">{t("addressTitle")}</h2>

			{showAddressList ? (
				<>
					<HybridAddressSelector
						addresses={userAddresses}
						selectedAddressId={selectedAddressId}
						onSelectAddress={onSelectAddress}
						defaultAddressId={defaultAddressId}
						emptyMessage={t("emptySavedShipping")}
						addressType="SHIPPING"
						sheetTitle={t("selectShippingAddressSheet")}
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
							{t("backToSavedAddresses")}
						</button>
					)}

					{/* Country selector */}
					<div className="space-y-2">
						<Label htmlFor="country" className="text-sm font-medium">
							{t("countryRegion")}
						</Label>
						<FormSelect
							id="country"
							name="countryCode"
							value={countryCode}
							onChange={onCountryChange}
							placeholder={t("selectCountry")}
							autoComplete="shipping country"
							options={availableCountries.map(({ code, label }) => ({
								value: code,
								label,
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
