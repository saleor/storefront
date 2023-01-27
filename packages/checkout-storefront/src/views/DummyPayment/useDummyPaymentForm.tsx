import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import { toast } from "react-toastify";
import { dummyPay as dummyPayRequest } from "../../fetch";
import { Text } from "@saleor/ui-kit";
import { dummyPaymentMessages } from "@/checkout-storefront/views/DummyPayment/messages";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { getOrderConfirmationUrl } from "@/checkout-storefront/views/DummyPayment/utils";
import { useFetch } from "@/checkout-storefront/hooks/useFetch";

interface DummyPaymentFormData {
  amount: number;
  currency: string;
}

const showError = (text: string) => toast(<Text>{text}</Text>, { type: "error" });

export const useDummyPaymentForm = ({ initialValues }: { initialValues: DummyPaymentFormData }) => {
  const formatMessage = useFormattedMessages();
  const orderId = getQueryParams().orderId ?? "";
  const [, pay] = useFetch(dummyPayRequest);

  const {
    env: { checkoutApiUrl },
    saleorApiUrl,
  } = useAppConfig();

  const dummyPay = async (formData: DummyPaymentFormData) => {
    try {
      const result = await pay({
        orderId,
        checkoutApiUrl,
        saleorApiUrl,
        amountCharged: formData,
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

  const form = useForm<DummyPaymentFormData>({
    onSubmit: dummyPay,
    initialValues,
    initialDirty: true,
  });

  return form;
};
