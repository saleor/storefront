import { Suspense, useState } from "react";
import { useCheckout } from "@/checkout/src/hooks/useCheckout";
import { Contact } from "@/checkout/src/sections/Contact";
import { DeliveryMethods } from "@/checkout/src/sections/DeliveryMethods";
import { ContactSkeleton } from "@/checkout/src/sections/Contact/ContactSkeleton";
import { DeliveryMethodsSkeleton } from "@/checkout/src/sections/DeliveryMethods/DeliveryMethodsSkeleton";
import { AddressSectionSkeleton } from "@/checkout/src/components/AddressSectionSkeleton";
import { getQueryParams } from "@/checkout/src/lib/utils/url";
import { CollapseSection } from "@/checkout/src/sections/CheckoutForm/CollapseSection";
import { Divider } from "@/checkout/src/components";
import { UserShippingAddressSection } from "@/checkout/src/sections/UserShippingAddressSection";
import { GuestShippingAddressSection } from "@/checkout/src/sections/GuestShippingAddressSection";
import { UserBillingAddressSection } from "@/checkout/src/sections/UserBillingAddressSection";
import { PaymentSection, PaymentSectionSkeleton } from "@/checkout/src/sections/PaymentSection";
import { GuestBillingAddressSection } from "@/checkout/src/sections/GuestBillingAddressSection";
import { useUser } from "@/checkout/src/hooks/useUser";

export const CheckoutForm = () => {
	const { user } = useUser();
	const { checkout } = useCheckout();
	const { passwordResetToken } = getQueryParams();

	const [showOnlyContact, setShowOnlyContact] = useState(!!passwordResetToken);

	return (
		<div className="flex flex-col items-end">
			<div className="flex w-full flex-col rounded">
				<Suspense fallback={<ContactSkeleton />}>
					<Contact setShowOnlyContact={setShowOnlyContact} />
				</Suspense>
				<>
					{checkout?.isShippingRequired && (
						<Suspense fallback={<AddressSectionSkeleton />}>
							<Divider />
							<CollapseSection collapse={showOnlyContact}>
								<div className="py-4" data-testid="shippingAddressSection">
									{user ? <UserShippingAddressSection /> : <GuestShippingAddressSection />}
								</div>
							</CollapseSection>
						</Suspense>
					)}
					<Suspense fallback={<DeliveryMethodsSkeleton />}>
						<DeliveryMethods collapsed={showOnlyContact} />
					</Suspense>
					<Suspense fallback={<PaymentSectionSkeleton />}>
						<CollapseSection collapse={showOnlyContact}>
							<PaymentSection>
								{user ? <UserBillingAddressSection /> : <GuestBillingAddressSection />}
							</PaymentSection>
						</CollapseSection>
					</Suspense>
				</>
			</div>
		</div>
	);
};
