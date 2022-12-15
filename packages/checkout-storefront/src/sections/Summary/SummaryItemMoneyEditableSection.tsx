import { Text } from "@saleor/ui-kit";
import {
  CheckoutLineFragment,
  useCheckoutLineDeleteMutation,
  useCheckoutLinesUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { TextInput } from "@/checkout-storefront/components/TextInput";

import { Skeleton } from "@/checkout-storefront/components";
import { SummaryItemMoneyInfo } from "@/checkout-storefront/sections/Summary/SummaryItemMoneyInfo";
import { summaryMessages } from "./messages";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";

interface LineItemQuantitySelectorProps {
  line: CheckoutLineFragment;
}

export interface SummaryLineFormData {
  quantity: string;
}

export const SummaryItemMoneyEditableSection: React.FC<LineItemQuantitySelectorProps> = ({
  line,
}) => {
  const [{ fetching: updating }, updateLines] = useCheckoutLinesUpdateMutation();
  const [, deleteLines] = useCheckoutLineDeleteMutation();
  const formatMessage = useFormattedMessages();

  const { onSubmit } = useSubmit<SummaryLineFormData, typeof updateLines>({
    scope: "checkoutLinesUpdate",
    onSubmit: updateLines,
    parse: ({ quantity, languageCode, checkoutId }) => ({
      languageCode,
      checkoutId,
      lines: [
        {
          quantity: Number(quantity),
          variantId: line.variant.id,
        },
      ],
    }),
    onError: ({ formData: { quantity }, setFieldValue }) => {
      setFieldValue("quantity", quantity);
    },
  });

  const form = useForm<SummaryLineFormData>({
    onSubmit,
    initialValues: { quantity: line.quantity.toString() },
  });

  const {
    handleBlur,
    handleSubmit,
    setFieldValue,
    values: { quantity: quantityString },
  } = form;

  const quantity = parseInt(quantityString);

  const { onSubmit: onLineDelete } = useSubmit<{}, typeof deleteLines>({
    scope: "checkoutLinesDelete",
    onSubmit: deleteLines,
    parse: ({ languageCode, checkoutId }) => ({ languageCode, checkoutId, line: line.id }),
  });

  const handleQuantityInputBlur = (event: React.FocusEvent<any, Element>) => {
    handleBlur(event);

    if (quantity === line.quantity) {
      return;
    }

    const isQuantityValid = !Number.isNaN(quantity) && quantity >= 0;

    if (quantityString === "" || !isQuantityValid) {
      void setFieldValue("quantity", String(line.quantity));
      return;
    }

    if (quantity === 0) {
      void onLineDelete();
      return;
    }

    void handleSubmit();
  };

  return (
    <div className="flex flex-col items-end h-20 relative -top-2">
      <div className="flex flex-row items-baseline">
        <Text size="xs" className="mr-2">
          {formatMessage(summaryMessages.quantity)}:
        </Text>
        <FormProvider form={form}>
          <TextInput
            onBlur={handleQuantityInputBlur}
            name="quantity"
            classNames={{ container: "!w-13 !mb-0", input: "text-center !h-8" }}
            label=""
          />
        </FormProvider>
      </div>
      {updating ? (
        <div className="flex flex-col items-end mt-3 w-full">
          <Skeleton className="w-full" />
          <Skeleton className="w-2/3" />
        </div>
      ) : (
        <SummaryItemMoneyInfo {...line} classNames={{ container: "mt-1" }} />
      )}
    </div>
  );
};
