import React, { Suspense } from "react";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { getById } from "@/checkout/lib/utils/common";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { shippingMessages } from "@/checkout/sections/UserShippingAddressSection/messages";
import { UserAddressSectionContainer } from "@/checkout/sections/UserAddressSectionContainer";
import { useUserShippingAddressForm } from "@/checkout/sections/UserShippingAddressSection/useUserShippingAddressForm";
import { AddressCreateForm } from "@/checkout/sections/AddressCreateForm";
import { AddressEditForm } from "@/checkout/sections/AddressEditForm";
import { AddressList } from "@/checkout/sections/AddressList/AddressList";
import { type AddressFragment } from "@/checkout/graphql";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { useAvailableShippingCountries } from "@/checkout/hooks/useAvailableShippingCountries";

interface UserShippingAddressSectionProps {}

export const UserShippingAddressSection: React.FC<UserShippingAddressSectionProps> = ({}) => {
	const formatMessage = useFormattedMessages();
	const { availableShippingCountries } = useAvailableShippingCountries();
	const {
		form,
		userAddressActions: { onAddressCreateSuccess, onAddressDeleteSuccess, onAddressUpdateSuccess },
	} = useUserShippingAddressForm();

	useCheckoutFormValidationTrigger({
		scope: "shippingAddress",
		form: form,
	});

	return (
		<Suspense fallback={<AddressSectionSkeleton />}>
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
								availableCountries={availableShippingCountries}
								onClose={() => setDisplayAddressCreate(false)}
								onSuccess={onAddressCreateSuccess}
							/>
						)}

						{displayAddressEdit && (
							<AddressEditForm
								availableCountries={availableShippingCountries}
								title={formatMessage(shippingMessages.shippingAddress)}
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
								title={formatMessage(shippingMessages.shippingAddress)}
								checkAddressAvailability={true}
								form={form}
							/>
						)}
					</>
				)}
			</UserAddressSectionContainer>
		</Suspense>
	);
};
