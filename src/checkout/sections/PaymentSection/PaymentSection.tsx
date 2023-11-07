import React from "react";
import { PaymentMethods } from "./PaymentMethods";
import { Divider } from "@/checkout/components/Divider";
import { Title } from "@/checkout/components/Title";
import { type Children } from "@/checkout/lib/globalTypes";

export const PaymentSection: React.FC<Children> = ({ children }) => {
	return (
		<>
			<Divider />
			<div className="py-6" data-testid="paymentMethods">
				<Title>Payment methods</Title>
				<PaymentMethods />
				{children}
			</div>
		</>
	);
};
