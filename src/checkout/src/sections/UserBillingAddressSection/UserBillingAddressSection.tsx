import React, { Suspense } from "react";
import { useCheckoutFormValidationTrigger } from "@/checkout/src/hooks/useCheckoutFormValidationTrigger";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { getById } from "@/checkout/src/lib/utils/common";
import { AddressSectionSkeleton } from "@/checkout/src/components/AddressSectionSkeleton";
import { UserAddressSectionContainer } from "@/checkout/src/sections/UserAddressSectionContainer";
import { useUserBillingAddressForm } from "@/checkout/src/sections/UserBillingAddressSection/useUserBillingAddressForm";
import { AddressCreateForm } from "@/checkout/src/sections/AddressCreateForm/AddressCreateForm";
import { AddressEditForm } from "@/checkout/src/sections/AddressEditForm/AddressEditForm";
import { AddressList } from "@/checkout/src/sections/AddressList/AddressList";
import { Checkbox } from "@/checkout/src/components";
import { useCheckout } from "@/checkout/src/hooks/useCheckout";
import { FormProvider } from "@/checkout/src/hooks/useForm/FormProvider";
import { useBillingSameAsShippingForm } from "@/checkout/src/sections/GuestBillingAddressSection/useBillingSameAsShippingForm";
import { billingMessages } from "@/checkout/src/sections/UserBillingAddressSection/messages";
import { type OptionalAddress } from "@/checkout/src/components/AddressForm/types";
import { getByMatchingAddress } from "@/checkout/src/components/AddressForm/utils";
import { type AddressFragment } from "@/checkout/src/graphql";

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
						classNames={{ container: "!mb-0" }}
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
