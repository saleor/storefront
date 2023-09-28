import React from "react";
import { PaymentMethods } from "./PaymentMethods";
import { paymentSectionMessages } from "./messages";
import { Divider } from "@/checkout/src/components/Divider";
import { Title } from "@/checkout/src/components/Title";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { type Children } from "@/checkout/src/lib/globalTypes";

export const PaymentSection: React.FC<Children> = ({ children }) => {
	const formatMessage = useFormattedMessages();

	return (
		<>
			<Divider />
			<div className="px-4 pb-6 pt-5" data-testid="paymentMethods">
				<Title>{formatMessage(paymentSectionMessages.paymentMethods)}</Title>
				<PaymentMethods />
				{children}
			</div>
		</>
	);
};
