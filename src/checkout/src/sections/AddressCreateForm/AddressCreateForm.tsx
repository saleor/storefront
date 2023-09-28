/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { type AddressFormData } from "@/checkout/src/components/AddressForm/types";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { getEmptyAddressFormData, getAddressInputData } from "@/checkout/src/components/AddressForm/utils";
import { type ChangeHandler, useForm } from "@/checkout/src/hooks/useForm";
import { useFormSubmit } from "@/checkout/src/hooks/useFormSubmit";
import { AddressFormActions } from "@/checkout/src/components/ManualSaveAddressForm";
import { addressCreateMessages } from "@/checkout/src/sections/AddressCreateForm/messages";
import { useAddressFormSchema } from "@/checkout/src/components/AddressForm/useAddressFormSchema";
import { AddressForm, type AddressFormProps } from "@/checkout/src/components/AddressForm";
import { type AddressFragment, type CountryCode, useUserAddressCreateMutation } from "@/checkout/src/graphql";
import { FormProvider } from "@/checkout/src/hooks/useForm/FormProvider";

export interface AddressCreateFormProps extends Pick<AddressFormProps, "availableCountries"> {
	onSuccess: (address: AddressFragment) => void;
	onClose: () => void;
}

export const AddressCreateForm: React.FC<AddressCreateFormProps> = ({
	onSuccess,
	onClose,
	availableCountries,
}) => {
	const formatMessage = useFormattedMessages();
	const [, userAddressCreate] = useUserAddressCreateMutation();
	const { setCountryCode, validationSchema } = useAddressFormSchema();

	const onSubmit = useFormSubmit<AddressFormData, typeof userAddressCreate>({
		scope: "userAddressCreate",
		onSubmit: userAddressCreate,
		parse: (addressFormData) => ({ address: getAddressInputData(addressFormData) }),
		onSuccess: ({ data }) => {
			onSuccess(data.address as AddressFragment);
			onClose();
		},
	});

	const form = useForm<AddressFormData>({
		validationSchema,
		initialValues: getEmptyAddressFormData(),
		onSubmit,
	});

	const { handleSubmit, isSubmitting, handleChange } = form;

	const onChange: ChangeHandler = (event) => {
		const { name, value } = event.target;

		if (name === "countryCode") {
			setCountryCode(value as CountryCode);
		}

		handleChange(event);
	};

	return (
		<FormProvider form={{ ...form, handleChange: onChange }}>
			<AddressForm
				title={formatMessage(addressCreateMessages.addressCreate)}
				availableCountries={availableCountries}
			>
				<AddressFormActions onSubmit={handleSubmit} loading={isSubmitting} onCancel={onClose} />
			</AddressForm>
		</FormProvider>
	);
};
