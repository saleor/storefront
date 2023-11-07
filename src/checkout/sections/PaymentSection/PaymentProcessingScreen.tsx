import { BarLoader } from "react-spinners";
import React, { useEffect, useState } from "react";
import { Title } from "@/checkout/components";
import { SaleorLogo } from "@/checkout/assets/images/SaleorLogo";
import { type Children } from "@/checkout/lib/globalTypes";
import { createSafeContext } from "@/checkout/providers/createSafeContext";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { PAGE_ID } from "@/checkout/views/Checkout/consts";

interface PaymentProcessingContextConsumerProps {
	setIsProcessingPayment: (processing: boolean) => void;
}

const [usePaymentProcessingScreen, Provider] = createSafeContext<PaymentProcessingContextConsumerProps>();

interface PaymentProcessingScreenProps extends Children {}

export const PaymentProcessingScreen: React.FC<PaymentProcessingScreenProps> = ({ children }) => {
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
	}, [isProcessingPayment]);

	return (
		<Provider value={{ setIsProcessingPayment: handleSetProcessing }}>
			{isProcessingPayment && (
				<div className="z-1000 bg-background-primary absolute left-0 top-0 m-auto flex h-screen w-screen flex-col items-center">
					<SaleorLogo />
					<div className="flex flex-grow flex-col justify-center pb-40">
						<Title>Almost done…</Title>
						<BarLoader />
					</div>
				</div>
			)}
			<>{children}</>
		</Provider>
	);
};

export { usePaymentProcessingScreen };
