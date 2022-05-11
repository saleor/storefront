import { PaymentChargeStatusEnum } from "@/graphql";
import { Text } from "@saleor/ui-kit";

import { Section, SectionTitle } from "./Section";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";

const unpaidStatuses: PaymentChargeStatusEnum[] = [
  "CANCELLED",
  "NOT_CHARGED",
  "REFUSED",
];
const paidStatuses: PaymentChargeStatusEnum[] = ["FULLY_CHARGED", "PENDING"];

export const PaymentSection = ({
  isPaid,
  paymentStatus,
}: {
  isPaid: boolean;
  paymentStatus: PaymentChargeStatusEnum;
}) => {
  const formatMessage = useFormattedMessages();

  const renderPaymentDetails = () => {
    if (unpaidStatuses.includes(paymentStatus)) {
      return (
        <>
          <Text color="error">{formatMessage("unpaidOrderMessage")}</Text>
        </>
      );
    }

    if (isPaid || paidStatuses.includes(paymentStatus)) {
      return <Text color="success">{formatMessage("paidOrderMessage")}</Text>;
    }

    // TODO: Add support for partial payments

    return null;
  };

  return (
    <Section>
      <SectionTitle>{formatMessage("paymentSection")}</SectionTitle>
      <div>{renderPaymentDetails()}</div>
    </Section>
  );
};
