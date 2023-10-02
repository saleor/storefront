import React from "react";
import { PaymentMethods } from "./PaymentMethods";
import { paymentSectionMessages } from "./messages";
import { Divider } from "@/checkout/components/Divider";
import { Title } from "@/checkout/components/Title";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { type Children } from "@/checkout/lib/globalTypes";

export const PaymentSection: React.FC<Children> = ({ children }) => {
	const formatMessage = useFormattedMessages();

	return (
		<>
			<Divider />
			<div className="py-6" data-testid="paymentMethods">
				<Title>{formatMessage(paymentSectionMessages.paymentMethods)}</Title>
				<PaymentMethods />
				{children}
			</div>
		</>
	);
};
