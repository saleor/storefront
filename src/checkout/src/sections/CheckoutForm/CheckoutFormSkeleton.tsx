import React from "react";
import { ContactSkeleton } from "@/checkout/src/sections/Contact";
import { DeliveryMethodsSkeleton } from "@/checkout/src/sections/DeliveryMethods";
import { PaymentSectionSkeleton } from "@/checkout/src/sections/PaymentSection";
import { Divider } from "@/checkout/src/components";
import { AddressSectionSkeleton } from "@/checkout/src/components/AddressSectionSkeleton";

export const CheckoutFormSkeleton = () => (
	<div className="checkout-form-container">
		<div className="checkout-form">
			<ContactSkeleton />
			<Divider />
			<AddressSectionSkeleton />
			<Divider />
			<DeliveryMethodsSkeleton />
			<Divider />
			<PaymentSectionSkeleton />
		</div>
	</div>
);
