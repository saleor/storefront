import React from "react";
import { Button, TextInput } from "../../components";
import { useOrderQuery } from "../../graphql";
import { dummyPaymentMessages } from "./messages";
import { localeToLanguageCode } from "@/checkout-storefront/lib/utils/locale";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";
import { useDummyPaymentForm } from "@/checkout-storefront/views/DummyPayment/useDummyPaymentForm";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";
import { getOrderConfirmationUrl } from "@/checkout-storefront/views/DummyPayment/utils";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";

export const DummyPayment = () => {
  const orderId = getQueryParams().orderId ?? "";
  const { locale } = useLocale();
  const formatMessage = useFormattedMessages();
  const [orderResult] = useOrderQuery({
    variables: { languageCode: localeToLanguageCode(locale), id: orderId },
  });

  const orderPaymentAmount = orderResult.data?.order?.total.gross.amount ?? 0;
  const orderPaymentCurrency = orderResult.data?.order?.total.gross.currency ?? "";
  const paymentBalance = Math.abs(orderResult.data?.order?.totalBalance.amount ?? 0);
  const paymentCaptured = orderResult.data?.order?.totalCaptured;

  const form = useDummyPaymentForm({
    initialValues: { amount: paymentBalance, currency: orderPaymentCurrency },
  });

  const { isSubmitting } = form;

  React.useEffect(() => {
    if (orderResult.data?.order?.isPaid) {
      window.location.href = getOrderConfirmationUrl();
    }
  }, [orderResult.data?.order?.id, orderResult.data?.order?.isPaid]);

  return (
    <section className="h-screen flex justify-center items-center">
      <div className="flex flex-col gap-8">
        <h2 className="font-bold text-4xl text-center">
          {formatMessage(dummyPaymentMessages.dummyPayment)}
        </h2>
        <div className="checkout-form w-auto gap-4 px-4 py-4">
          <div className="flex flex-col">
            <p>
              <span className="text-text-secondary">
                {formatMessage(dummyPaymentMessages.orderTotalPrice)}
              </span>
              : {orderPaymentAmount} {orderPaymentCurrency}
            </p>
            <p>
              <span className="text-text-secondary">
                {formatMessage(dummyPaymentMessages.orderAlreadyPaid)}
              </span>
              : {paymentCaptured?.amount} {paymentCaptured?.currency}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <FormProvider form={form}>
              <TextInput
                name="amount"
                type="number"
                label={formatMessage(dummyPaymentMessages.dummyPaymentAmountPlaceholder, {
                  currency: orderPaymentCurrency.toUpperCase(),
                })}
                max={paymentBalance}
              />
              <Button
                disabled={orderResult.fetching}
                type="submit"
                ariaLabel={formatMessage(dummyPaymentMessages.dummyPay)}
                label={
                  isSubmitting
                    ? formatMessage(dummyPaymentMessages.loadingWithDots)
                    : formatMessage(dummyPaymentMessages.dummyPay)
                }
                data-testid="dummyPay"
              />
            </FormProvider>
          </div>
        </div>
      </div>
    </section>
  );
};
