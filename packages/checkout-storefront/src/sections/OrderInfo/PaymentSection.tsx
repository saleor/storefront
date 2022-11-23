import { Text } from "@saleor/ui-kit";

import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useFetch } from "@/checkout-storefront/hooks/useFetch";
import { getOrderPaymentStatus } from "@/checkout-storefront/fetch";

import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import { Section } from "./Section";
import { Skeleton } from "@/checkout-storefront/components/Skeleton";
import { CheckIcon } from "@/checkout-storefront/icons";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { orderInfoMessages } from "./messages";
import { imageAltMessages } from "@/checkout-storefront/lib/commonMessages";
import { PaymentStatusResponse } from "checkout-common";

interface PaymentDetailsProps {
  paymentStatusLoading: boolean;
  paymentData: PaymentStatusResponse | null | undefined;
}

const PaymentDetails = ({ paymentStatusLoading, paymentData }: PaymentDetailsProps) => {
  const formatMessage = useFormattedMessages();

  if (paymentStatusLoading) {
    return <Skeleton className="w-1/2" />;
  }

  if (paymentData?.status === "PAID") {
    return (
      <div className="flex flex-row items-center">
        <Text color="success" className="mr-1">
          {formatMessage(orderInfoMessages.orderPaid)}
        </Text>
        <img src={getSvgSrc(CheckIcon)} alt={formatMessage(imageAltMessages.checkIcon)} />
      </div>
    );
  }

  if (paymentData?.status === "PENDING") {
    return <Text color="success">{formatMessage(orderInfoMessages.paymentPending)}</Text>;
  }

  if (paymentData?.status === "UNPAID") {
    return (
      <div>
        <Text color="error">{formatMessage(orderInfoMessages.orderUnpaid)}</Text>
      </div>
    );
  }

  return <Text color="error">{formatMessage(orderInfoMessages.orderPaymentStatusMissing)}</Text>;
};

export const PaymentSection = ({ orderId }: { orderId: string }) => {
  const { env, saleorApiUrl } = useAppConfig();

  const [{ data: paymentData, loading: paymentStatusLoading }] = useFetch(getOrderPaymentStatus, {
    args: { orderId, checkoutApiUrl: env.checkoutApiUrl, saleorApiUrl },
  });

  const formatMessage = useFormattedMessages();

  return (
    <Section title={formatMessage(orderInfoMessages.paymentSection)}>
      <div data-testid="paymentStatus">
        <PaymentDetails paymentData={paymentData} paymentStatusLoading={paymentStatusLoading} />
      </div>
    </Section>
  );
};
