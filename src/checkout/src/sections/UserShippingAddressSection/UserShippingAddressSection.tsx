import React, { Suspense } from "react";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { getById } from "@/checkout/src/lib/utils/common";
import { AddressSectionSkeleton } from "@/checkout/src/components/AddressSectionSkeleton";
import { shippingMessages } from "@/checkout/src/sections/UserShippingAddressSection/messages";
import { UserAddressSectionContainer } from "@/checkout/src/sections/UserAddressSectionContainer";
import { useUserShippingAddressForm } from "@/checkout/src/sections/UserShippingAddressSection/useUserShippingAddressForm";
import { AddressCreateForm } from "@/checkout/src/sections/AddressCreateForm";
import { AddressEditForm } from "@/checkout/src/sections/AddressEditForm";
import { AddressList } from "@/checkout/src/sections/AddressList/AddressList";
import { type AddressFragment } from "@/checkout/src/graphql";
import { useCheckoutFormValidationTrigger } from "@/checkout/src/hooks/useCheckoutFormValidationTrigger";
import { useAvailableShippingCountries } from "@/checkout/src/hooks/useAvailableShippingCountries";

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
