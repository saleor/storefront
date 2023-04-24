import { Title } from "@/checkout-storefront/components";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { SaleorLogo } from "@/checkout-storefront/images";
import { Children } from "@/checkout-storefront/lib/globalTypes";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { paymentSectionMessages } from "@/checkout-storefront/sections/PaymentSection/messages";
import { BarLoader } from "react-spinners";
import React, { useEffect, useState } from "react";
import { createSafeContext } from "@/checkout-storefront/providers/createSafeContext";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";
import { PAGE_ID } from "@/checkout-storefront/views/Checkout/consts";

interface PaymentProcessingContextConsumerProps {
  setIsProcessingPayment: (processing: boolean) => void;
}

const [usePaymentProcessingScreen, Provider] =
  createSafeContext<PaymentProcessingContextConsumerProps>();

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
        <div className="m-auto left-0 top-0 w-screen h-screen absolute z-1000 bg-background-primary flex flex-col items-center">
          <img src={getSvgSrc(SaleorLogo)} alt="logo" className="logo mt-20" />
          <div className="flex flex-col justify-center flex-grow pb-40">
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
