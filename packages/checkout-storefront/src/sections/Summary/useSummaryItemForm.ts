import {
  CheckoutLineFragment,
  useCheckoutLineDeleteMutation,
  useCheckoutLinesUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit/useSubmit";

export interface SummaryItemFormProps {
  line: CheckoutLineFragment;
}

export interface SummaryLineFormData {
  quantity: string;
}

export const useSummaryItemForm = ({ line }: SummaryItemFormProps) => {
  const [, updateLines] = useCheckoutLinesUpdateMutation();
  const [, deleteLines] = useCheckoutLineDeleteMutation();

  const onSubmit = useFormSubmit<SummaryLineFormData, typeof updateLines>({
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
    onError: ({ formData: { quantity }, formHelpers: { setFieldValue } }) => {
      setFieldValue("quantity", quantity);
    },
  });

  const form = useForm<SummaryLineFormData>({
    onSubmit,
    initialValues: { quantity: line.quantity.toString() },
  });

  const onLineDelete = useSubmit<{}, typeof deleteLines>({
    scope: "checkoutLinesDelete",
    onSubmit: deleteLines,
    parse: ({ languageCode, checkoutId }) => ({ languageCode, checkoutId, lineId: line.id }),
  });

  return { form, onLineDelete };
};
