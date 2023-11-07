import React from "react";
import { ContactSkeleton } from "@/checkout/sections/Contact";
import { DeliveryMethodsSkeleton } from "@/checkout/sections/DeliveryMethods";
import { PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection";
import { Divider } from "@/checkout/components";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";

export const CheckoutFormSkeleton = () => (
	<div className="flex flex-col items-end">
		<div className="flex w-full flex-col rounded ">
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
