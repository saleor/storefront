import { Button, Text } from "@saleor/ui-kit";

import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { usePay } from "@/checkout-storefront/hooks/usePay";
import { useFetch } from "@/checkout-storefront/hooks/useFetch";
import { getOrderPaymentStatus } from "@/checkout-storefront/fetch";

import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import { Section } from "./Section";
import { Skeleton } from "@/checkout-storefront/components/Skeleton";
import { CheckIcon } from "@/checkout-storefront/icons";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";

export const PaymentSection = ({ orderId }: { orderId: string }) => {
  const { loading: orderPayLoading, orderPay } = usePay();
  const { env } = useAppConfig();

  const [{ data: paymentData, loading: paymentStatusLoading }] = useFetch(getOrderPaymentStatus, {
    args: { orderId, checkoutApiUrl: env.checkoutApiUrl },
  });

  const formatMessage = useFormattedMessages();

  const handlePay = () => {
    return orderPay({
      provider: "mollie", // TODO: Hardcoded payment provider
      method: "creditCard", // TODO: Hardcoded payment provider
      orderId,
    });
  };

  const renderPaymentDetails = () => {
    if (paymentStatusLoading) {
      return <Skeleton className="w-1/2" />;
    }

    if (paymentData?.status === "PAID") {
      return (
        <div className="flex flex-row items-center">
          <Text color="success" className="mr-1">
            {formatMessage("paidOrderMessage")}
          </Text>
          <img src={getSvgSrc(CheckIcon)} />
        </div>
      );
    }

    if (paymentData?.status === "PENDING") {
      return <Text color="success">{formatMessage("pendingPaymentOrderMessage")}</Text>;
    }

    if (paymentData?.status === "UNPAID") {
      return (
        <div>
          <Text color="error">{formatMessage("unpaidOrderMessage")}</Text>
          <Button
            className="mt-2"
            aria-label={formatMessage("orderPayButtonLabel")}
            label={formatMessage("orderPayButtonLabel")}
            onClick={() => {
              void handlePay();
            }}
            disabled={orderPayLoading}
          />
        </div>
      );
    }

    return <Text color="error">{formatMessage("missingPaymentStatusOrderMessage")}</Text>;
  };

  return (
    <Section title={formatMessage("paymentSection")}>
      <div>{renderPaymentDetails()}</div>
    </Section>
  );
};
