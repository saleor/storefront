import { Suspense } from "react";

import PageHeader from "@/checkout-storefront/sections/PageHeader";
import { Title } from "@/checkout-storefront/components/Title";
import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { Divider } from "@/checkout-storefront/components/Divider";
import { SummarySkeleton } from "@/checkout-storefront/sections/Summary/SummarySkeleton";
import { Skeleton } from "@/checkout-storefront/components/Skeleton";

export const OrderConfirmationSkeleton = () => {
  const formatMessage = useFormattedMessages();

  return (
    <div className="page">
      <header className="order-header">
        <PageHeader />
        <Title>{formatMessage("orderConfirmationTitle", { number: "" })}</Title>
        <Text size="md" className="max-w-[692px]">
          {formatMessage("orderConfirmationSubtitle", {
            email: "",
          })}
        </Text>
      </header>
      <Divider />
      <main className="order-content overflow-hidden">
        <div className="w-7/12">
          <Text size="lg" weight="bold">
            {formatMessage("paymentSection")}
          </Text>
          <Skeleton variant="title" className="mt-6" />
          <Skeleton />
          <Skeleton variant="title" />
          <Skeleton />
          <Skeleton variant="title" />
          <Skeleton />
        </div>
        <div className="order-divider" />
        <div className="summary px-8 w-[594px]">
          <Text size="lg" weight="bold">
            {formatMessage("summary")}
          </Text>
          <Skeleton variant="title" className="mt-6" />
          <Skeleton />
          <Skeleton variant="title" />
          <Skeleton />
          <Skeleton variant="title" />
          <Skeleton />
        </div>
      </main>
    </div>
  );
};
