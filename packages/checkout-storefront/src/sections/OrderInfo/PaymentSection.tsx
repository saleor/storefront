import { Text } from "@saleor/ui-kit";

import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";

import { Section } from "./Section";
import { CheckIcon, ExclamationIcon } from "@/checkout-storefront/icons";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { orderInfoMessages } from "./messages";
import { imageAltMessages } from "@/checkout-storefront/lib/commonMessages";
import { useOrder } from "@/checkout-storefront/hooks/useOrder";
import { usePaymentStatus } from "@/checkout-storefront/sections/PaymentSection/utils";
import { ShippingMethod } from "@/checkout-storefront/graphql";

const ErrorMessage = ({ message }: { message: string }) => {
  const formatMessage = useFormattedMessages();

  return (
    <>
      <Text color="error" className="mr-1">
        {message}
      </Text>
      <img src={getSvgSrc(ExclamationIcon)} alt={formatMessage(imageAltMessages.exclamationIcon)} />
    </>
  );
};

const SuccessMessage = ({ message }: { message: string }) => {
  const formatMessage = useFormattedMessages();

  return (
    <>
      <Text color="success" className="mr-1">
        {message}
      </Text>
      <img src={getSvgSrc(CheckIcon)} alt={formatMessage(imageAltMessages.checkIcon)} />
    </>
  );
};

export const PaymentSection = () => {
  const formatMessage = useFormattedMessages();
  const { order } = useOrder();
  const paymentStatus = usePaymentStatus(order);
  let deliveryMethodName;
  if (order.deliveryMethod?.__typename === "ShippingMethod") {
    deliveryMethodName = order.deliveryMethod.name;
  } else {
    deliveryMethodName = "";
  }
  let cashOnDelivery: boolean;
  if (deliveryMethodName && deliveryMethodName.includes("pobranie")) {
    cashOnDelivery = true;
  } else {
    cashOnDelivery = false;
  }
  return (
    <Section title={formatMessage(orderInfoMessages.paymentSection)}>
      <div data-testid="paymentStatus">
        <div className="flex flex-row items-center">
          {cashOnDelivery && (
            <SuccessMessage message={formatMessage(orderInfoMessages.orderPaidOnDelivery)} />
          )}
          {paymentStatus === "authorized" && !cashOnDelivery && (
            <SuccessMessage message={formatMessage(orderInfoMessages.orderAuthorized)} />
          )}

          {paymentStatus === "paidInFull" && !cashOnDelivery && (
            <SuccessMessage message={formatMessage(orderInfoMessages.orderPaid)} />
          )}

          {paymentStatus === "overpaid" && !cashOnDelivery && (
            <ErrorMessage message={formatMessage(orderInfoMessages.orderOvercharged)} />
          )}
        </div>
      </div>
    </Section>
  );
};
