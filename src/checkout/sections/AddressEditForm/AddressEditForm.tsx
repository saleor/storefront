/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { type AddressFormData } from "@/checkout/components/AddressForm/types";
import { AddressForm, type AddressFormProps } from "@/checkout/components/AddressForm";
import {
	type AddressFragment,
	type CountryCode,
	useUserAddressDeleteMutation,
	useUserAddressUpdateMutation,
} from "@/checkout/graphql";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { getAddressFormDataFromAddress, getAddressInputData } from "@/checkout/components/AddressForm/utils";
import { type ChangeHandler, useForm } from "@/checkout/hooks/useForm";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { AddressFormActions } from "@/checkout/components/ManualSaveAddressForm";
import { addressEditMessages } from "@/checkout/sections/AddressEditForm/messages";
import { useAddressFormSchema } from "@/checkout/components/AddressForm/useAddressFormSchema";
import { useSubmit } from "@/checkout/hooks/useSubmit/useSubmit";

export interface AddressEditFormProps extends Pick<AddressFormProps, "title" | "availableCountries"> {
	address: AddressFragment;
	onUpdate: (address: AddressFragment) => void;
	onDelete: (id: string) => void;
	onClose: () => void;
}

export const AddressEditForm: React.FC<AddressEditFormProps> = ({
	onUpdate,
	onClose,
	onDelete,
	address,
	availableCountries,
}) => {
	const formatMessage = useFormattedMessages();
	const [{ fetching: updating }, userAddressUpdate] = useUserAddressUpdateMutation();
	const [{ fetching: deleting }, userAddressDelete] = useUserAddressDeleteMutation();
	const { setCountryCode, validationSchema } = useAddressFormSchema();

	const onSubmit = useFormSubmit<AddressFormData, typeof userAddressUpdate>({
		scope: "userAddressUpdate",
		onSubmit: userAddressUpdate,
		parse: (formData) => ({ id: address.id, address: { ...getAddressInputData(formData) } }),
		onSuccess: ({ data: { address } }) => {
			if (address) {
				onUpdate(address);
			}
			onClose();
		},
	});

	const onAddressDelete = useSubmit<{ id: string }, typeof userAddressDelete>({
		scope: "userAddressDelete",
		onSubmit: userAddressDelete,
		parse: ({ id }) => ({ id }),
		onSuccess: ({ formData: { id } }) => {
			onDelete(id);
			onClose();
		},
	});

	const form = useForm<AddressFormData>({
		validationSchema,
		initialValues: getAddressFormDataFromAddress(address),
		onSubmit,
	});

	const { handleSubmit, handleChange } = form;

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
				title={formatMessage(addressEditMessages.editAddress)}
				availableCountries={availableCountries}
			>
				<AddressFormActions
					onSubmit={handleSubmit}
					loading={updating || deleting}
					onCancel={onClose}
					onDelete={() => onAddressDelete({ id: address.id })}
				/>
			</AddressForm>
		</FormProvider>
	);
};
