import React, { Suspense } from "react";
import { AddressForm } from "@/checkout/components/AddressForm";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import { useGuestBillingAddressForm } from "@/checkout/sections/GuestBillingAddressSection/useGuestBillingAddressForm";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { useBillingSameAsShippingForm } from "@/checkout/sections/GuestBillingAddressSection/useBillingSameAsShippingForm";
import { Checkbox } from "@/checkout/components";

export const GuestBillingAddressSection = () => {
	const {
		checkout: { isShippingRequired },
	} = useCheckout();

	const billingSameAsShippingForm = useBillingSameAsShippingForm({ autoSave: true });

	const {
		values: { billingSameAsShipping },
	} = billingSameAsShippingForm;

	// we want to avoid validating this form on "pay" click when it's not visible
	const form = useGuestBillingAddressForm({ skipValidation: billingSameAsShipping });

	const { handleBlur, handleChange } = form;

	return (
		<Suspense fallback={<AddressSectionSkeleton />}>
			{isShippingRequired && (
				<FormProvider form={billingSameAsShippingForm}>
					<Checkbox
						name="billingSameAsShipping"
						label="Use shipping address as billing address"
						data-testid="useShippingAsBillingCheckbox"
					/>
				</FormProvider>
			)}
			{!billingSameAsShipping && (
				<FormProvider form={form}>
					<AddressForm
						title="Billing address"
						fieldProps={{
							onChange: handleChange,
							onBlur: handleBlur,
						}}
					/>
				</FormProvider>
			)}
		</Suspense>
	);
};
