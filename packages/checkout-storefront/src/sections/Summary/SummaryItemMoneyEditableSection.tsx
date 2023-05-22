import { Text } from "@saleor/ui-kit";
import { CheckoutLineFragment } from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { TextInput } from "@/checkout-storefront/components/TextInput";

import { Skeleton } from "@/checkout-storefront/components";
import { SummaryItemMoneyInfo } from "@/checkout-storefront/sections/Summary/SummaryItemMoneyInfo";
import { summaryMessages } from "./messages";
import { FormProvider } from "@/checkout-storefront/hooks/useForm/FormProvider";
import { useSummaryItemForm } from "@/checkout-storefront/sections/Summary/useSummaryItemForm";
import { useMemo } from "react";

interface SummaryItemMoneyEditableSectionProps {
  line: CheckoutLineFragment;
}

export const SummaryItemMoneyEditableSection: React.FC<SummaryItemMoneyEditableSectionProps> = ({
  line,
}) => {
  const formatMessage = useFormattedMessages();
  const { form, onLineDelete } = useSummaryItemForm({ line });

  const {
    handleBlur,
    setFieldValue,
    handleSubmit,
    isSubmitting,
    values: { quantity: quantityString },
  } = form;

  const quantity = useMemo(() => parseInt(quantityString), [quantityString]);

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
      {isSubmitting ? (
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
