import { DummyPayRequestBody, DummyPayRequestResult } from "checkout-common";
import React from "react";
import { useForm } from "react-hook-form";
import { Button, TextInput } from "../../components";
import { dummyPay as dummyPayRequest } from "../../fetch";
import { useOrderQuery } from "../../graphql";
import { useFetch, useFormattedMessages, useGetInputProps } from "../../hooks";
import { useAppConfig } from "../../providers/AppConfigProvider";
import { toast } from "react-toastify";
import { Text } from "@saleor/ui-kit";
import { dummyPaymentMessages } from "./messages";
import { getQueryParams, localeToLanguageCode } from "@/checkout-storefront/lib/utils";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";

const getOrderConfirmationUrl = () => {
  const url = new URL(window.location.href);

  url.searchParams.delete("dummyPayment");

  return url.href;
};

type UseDummyPayValues = [
  { data?: DummyPayRequestResult | undefined | null; loading: boolean; error?: unknown },
  (charged: DummyPayRequestBody["amountCharged"]) => Promise<void>
];

const showError = (text: string) => toast(<Text>{text}</Text>, { type: "error" });

const useDummyPay = (): UseDummyPayValues => {
  const formatMessage = useFormattedMessages();
  const orderId = getQueryParams().orderId ?? "";
  const [dummyPayResult, pay] = useFetch(dummyPayRequest);
  const {
    env: { checkoutApiUrl },
  } = useAppConfig();

  const dummyPay = async (amountCharged: DummyPayRequestBody["amountCharged"]) => {
    try {
      const result = await pay({
        orderId,
        checkoutApiUrl,
        amountCharged,
      });

      if (result && result.ok) {
        window.location.href = getOrderConfirmationUrl();
      }

      if (result && !result.ok) {
        showError(result.error);
      }
    } catch (e: unknown) {
      const error = typeof e === "string" ? e : formatMessage(dummyPaymentMessages.error);
      showError(error);
    }
  };

  return [{ ...dummyPayResult }, dummyPay];
};

type DummyPaymentFormValues = {
  amount: number;
};

export const DummyPayment = () => {
  const orderId = getQueryParams().orderId ?? "";
  const { locale } = useLocale();
  const formatMessage = useFormattedMessages();
  const [orderResult] = useOrderQuery({
    variables: { languageCode: localeToLanguageCode(locale), id: orderId },
  });
  const [dummyPayResult, dummyPay] = useDummyPay();

  const orderPaymentAmount = orderResult.data?.order?.total.gross.amount ?? 0;
  const orderPaymentCurrency = orderResult.data?.order?.total.gross.currency ?? "";
  const paymentBalance = Math.abs(orderResult.data?.order?.totalBalance.amount ?? 0);
  const paymentCaptured = orderResult.data?.order?.totalCaptured;

  const formProps = useForm<DummyPaymentFormValues>({
    defaultValues: { amount: paymentBalance },
  });
  const { handleSubmit } = formProps;
  const getInputProps = useGetInputProps(formProps);

  const submitHandler = async ({ amount }: DummyPaymentFormValues) => {
    await dummyPay({ amount, currency: orderPaymentCurrency });
  };

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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitHandler)}>
            <TextInput
              {...getInputProps("amount")}
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
                dummyPayResult.loading
                  ? formatMessage(dummyPaymentMessages.loadingWithDots)
                  : formatMessage(dummyPaymentMessages.dummyPay)
              }
            />
          </form>
        </div>
      </div>
    </section>
  );
};
