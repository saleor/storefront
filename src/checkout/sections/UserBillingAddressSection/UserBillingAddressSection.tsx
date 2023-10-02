import React, { Suspense } from "react";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { getById } from "@/checkout/lib/utils/common";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { UserAddressSectionContainer } from "@/checkout/sections/UserAddressSectionContainer";
import { useUserBillingAddressForm } from "@/checkout/sections/UserBillingAddressSection/useUserBillingAddressForm";
import { AddressCreateForm } from "@/checkout/sections/AddressCreateForm/AddressCreateForm";
import { AddressEditForm } from "@/checkout/sections/AddressEditForm/AddressEditForm";
import { AddressList } from "@/checkout/sections/AddressList/AddressList";
import { Checkbox } from "@/checkout/components";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import { useBillingSameAsShippingForm } from "@/checkout/sections/GuestBillingAddressSection/useBillingSameAsShippingForm";
import { billingMessages } from "@/checkout/sections/UserBillingAddressSection/messages";
import { type OptionalAddress } from "@/checkout/components/AddressForm/types";
import { getByMatchingAddress } from "@/checkout/components/AddressForm/utils";
import { type AddressFragment } from "@/checkout/graphql";

interface UserBillingAddressSectionProps {}

export const UserBillingAddressSection: React.FC<UserBillingAddressSectionProps> = ({}) => {
	const formatMessage = useFormattedMessages();
	const {
		checkout: { isShippingRequired },
	} = useCheckout();

	const {
		form,
		userAddressActions: { onAddressCreateSuccess, onAddressDeleteSuccess, onAddressUpdateSuccess },
	} = useUserBillingAddressForm();

	const {
		resetForm,
		values: { addressList },
	} = form;

	const handleSetBillingSameAsShipping = (address: OptionalAddress) => {
		const matchingAddress = addressList.find(getByMatchingAddress(address));

		if (!address || !matchingAddress) {
			return;
		}

		resetForm({ values: { selectedAddressId: matchingAddress.id, addressList } });
	};

	const billingSameAsShippingForm = useBillingSameAsShippingForm({
		autoSave: false,
		onSetBillingSameAsShipping: handleSetBillingSameAsShipping,
	});

	useCheckoutFormValidationTrigger({
		scope: "billingAddress",
		form: billingSameAsShippingForm,
	});

	const {
		values: { billingSameAsShipping },
	} = billingSameAsShippingForm;

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
				<UserAddressSectionContainer>
					{({
						displayAddressCreate,
						displayAddressEdit,
						displayAddressList,
						setDisplayAddressCreate,
						setDisplayAddressEdit,
						editedAddressId,
					}) => (
						<>
							{displayAddressCreate && (
								<AddressCreateForm
									onClose={() => setDisplayAddressCreate(false)}
									onSuccess={onAddressCreateSuccess}
								/>
							)}

							{displayAddressEdit && (
								<AddressEditForm
									title={formatMessage(billingMessages.billingAddress)}
									onClose={() => setDisplayAddressEdit()}
									address={form.values.addressList.find(getById(editedAddressId)) as AddressFragment}
									onUpdate={onAddressUpdateSuccess}
									onDelete={onAddressDeleteSuccess}
								/>
							)}

							{displayAddressList && (
								<AddressList
									onEditChange={setDisplayAddressEdit}
									onAddAddressClick={() => setDisplayAddressCreate(true)}
									title={formatMessage(billingMessages.billingAddress)}
									form={form}
								/>
							)}
						</>
					)}
				</UserAddressSectionContainer>
			)}
		</Suspense>
	);
};
