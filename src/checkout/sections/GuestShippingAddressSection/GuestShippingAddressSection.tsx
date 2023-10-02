import React from "react";
import { AddressForm } from "@/checkout/components/AddressForm";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import { shippingMessages } from "@/checkout/sections/UserShippingAddressSection/messages";
import { useAvailableShippingCountries } from "@/checkout/hooks/useAvailableShippingCountries";
import { useGuestShippingAddressForm } from "@/checkout/sections/GuestShippingAddressSection/useGuestShippingAddressForm";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";

export const GuestShippingAddressSection = () => {
	const formatMessage = useFormattedMessages();
	const { availableShippingCountries } = useAvailableShippingCountries();

	const form = useGuestShippingAddressForm();

	const { handleChange, handleBlur } = form;

	return (
		<FormProvider form={form}>
			<AddressForm
				title={formatMessage(shippingMessages.shippingAddress)}
				availableCountries={availableShippingCountries}
				fieldProps={{
					onChange: handleChange,
					onBlur: handleBlur,
				}}
			/>
		</FormProvider>
	);
};
