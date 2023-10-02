import React, { Suspense } from "react";
import { AddressForm } from "@/checkout/components/AddressForm";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import { useGuestBillingAddressForm } from "@/checkout/sections/GuestBillingAddressSection/useGuestBillingAddressForm";
import { billingMessages } from "@/checkout/sections/UserBillingAddressSection/messages";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { useBillingSameAsShippingForm } from "@/checkout/sections/GuestBillingAddressSection/useBillingSameAsShippingForm";
import { Checkbox } from "@/checkout/components";

export const GuestBillingAddressSection = () => {
	const formatMessage = useFormattedMessages();
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
						label={formatMessage(billingMessages.useShippingAsBilling)}
						data-testid={"useShippingAsBillingCheckbox"}
					/>
				</FormProvider>
			)}
			{!billingSameAsShipping && (
				<FormProvider form={form}>
					<AddressForm
						title={formatMessage(billingMessages.billingAddress)}
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
