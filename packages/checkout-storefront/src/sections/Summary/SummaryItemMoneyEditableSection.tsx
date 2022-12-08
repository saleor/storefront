import { Text } from "@saleor/ui-kit";
import {
  CheckoutLineFragment,
  useCheckoutLineDeleteMutation,
  useCheckoutLinesUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { TextInput } from "@/checkout-storefront/components/TextInput";

import { useValidationResolver } from "@/checkout-storefront/lib/utils";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { Skeleton } from "@/checkout-storefront/components";
import { useErrorMessages } from "@/checkout-storefront/hooks";
import { SummaryItemMoneyInfo } from "@/checkout-storefront/sections/Summary/SummaryItemMoneyInfo";
import { summaryMessages } from "./messages";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";

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
  const { setApiErrors } = useErrors<SummaryLineFormData>();
  const { errorMessages } = useErrorMessages();
  const formatMessage = useFormattedMessages();

  const schema = object({
    quantity: string().required(errorMessages.required),
  });

  const resolver = useValidationResolver(schema);
  const methods = useForm<SummaryLineFormData>({
    resolver,
    defaultValues: { quantity: line.quantity.toString() },
  });

  const { watch, setValue } = methods;

  const getInputProps = useGetInputProps(methods);

  const quantityString = watch("quantity");
  const quantity = Number(quantityString);

  const handleLineQuantityUpdate = useSubmit<SummaryLineFormData, typeof updateLines>({
    scope: "checkoutLinesUpdate",
    onSubmit: updateLines,
    formDataParse: ({ quantity, languageCode, checkoutId }) => ({
      languageCode,
      checkoutId,
      lines: [
        {
          quantity: Number(quantity),
          variantId: line.variant.id,
        },
      ],
    }),
    onError: (errors, { quantity }) => {
      setValue("quantity", quantity);
      setApiErrors(errors);
    },
  });

  const handleLineDelete = useSubmit<{}, typeof deleteLines>({
    scope: "checkoutLinesDelete",
    onSubmit: deleteLines,
    formDataParse: ({ languageCode, checkoutId }) => ({ languageCode, checkoutId, line: line.id }),
    onError: (errors) => setApiErrors(errors),
  });

  const handleQuantityInputBlur = () => {
    if (quantity === line.quantity) {
      return;
    }

    const isQuantityValid = !Number.isNaN(quantity) && quantity >= 0;

    if (quantityString === "" || !isQuantityValid) {
      setValue("quantity", String(line.quantity));
      return;
    }

    if (quantity === 0) {
      void handleLineDelete({});
      return;
    }

    void handleLineQuantityUpdate({ quantity: quantityString });
  };

  return (
    <div className="flex flex-col items-end h-20 relative -top-2">
      <div className="flex flex-row items-baseline">
        <Text size="xs" className="mr-2">
          {formatMessage(summaryMessages.quantity)}:
        </Text>
        <TextInput
          classNames={{ container: "!w-13 !mb-0", input: "text-center !h-8" }}
          label=""
          {...getInputProps("quantity", { onBlur: handleQuantityInputBlur })}
        />
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
