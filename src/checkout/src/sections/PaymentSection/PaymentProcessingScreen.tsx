import { BarLoader } from "react-spinners";
import React, { useEffect, useState } from "react";
import { Title } from "@/checkout/src/components";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { SaleorLogo } from "@/checkout/src/assets/images";
import { type Children } from "@/checkout/src/lib/globalTypes";
import { paymentSectionMessages } from "@/checkout/src/sections/PaymentSection/messages";
import { createSafeContext } from "@/checkout/src/providers/createSafeContext";
import { getQueryParams } from "@/checkout/src/lib/utils/url";
import { PAGE_ID } from "@/checkout/src/views/Checkout/consts";

interface PaymentProcessingContextConsumerProps {
	setIsProcessingPayment: (processing: boolean) => void;
}

const [usePaymentProcessingScreen, Provider] = createSafeContext<PaymentProcessingContextConsumerProps>();

interface PaymentProcessingScreenProps extends Children {}

export const PaymentProcessingScreen: React.FC<PaymentProcessingScreenProps> = ({ children }) => {
	const formatMessage = useFormattedMessages();

	const handleSetStyles = (processing: boolean) => {
		const el = document.getElementById(PAGE_ID);

		if (el) {
			el.style.maxHeight = processing ? "100vh" : "auto";
			el.style.overflow = processing ? "hidden" : "auto";
		}
	};

	const getInitialProcessing = () => {
		const { transaction, processingPayment } = getQueryParams();

		return !!(transaction && processingPayment);
	};

	const [isProcessingPayment, setIsProcessingPayment] = useState(getInitialProcessing());

	const handleSetProcessing = (processing: boolean) => {
		handleSetStyles(processing);
		setIsProcessingPayment(processing);
	};

	useEffect(() => {
		handleSetStyles(isProcessingPayment);
	}, []);

	return (
		<Provider value={{ setIsProcessingPayment: handleSetProcessing }}>
			{isProcessingPayment && (
				<div className="z-1000 bg-background-primary absolute left-0 top-0 m-auto flex h-screen w-screen flex-col items-center">
					<SaleorLogo />
					<div className="flex flex-grow flex-col justify-center pb-40">
						<Title>{formatMessage(paymentSectionMessages.processingPayment)}</Title>
						<BarLoader />
					</div>
				</div>
			)}
			<>{children}</>
		</Provider>
	);
};

export { usePaymentProcessingScreen };
