import clsx from "clsx";
import { Text } from "@saleor/ui-kit";
import {
  CheckoutLineFragment,
  CheckoutLinesUpdateMutationVariables,
  useCheckoutLineDeleteMutation,
  useCheckoutLinesUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { Money } from "@/checkout-storefront/components/Money";
import { TextInput } from "@/checkout-storefront/components/TextInput";

import { useEffect } from "react";
import {
  extractMutationErrors,
  getFormattedMoney,
  useValidationResolver,
} from "@/checkout-storefront/lib/utils";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { Skeleton } from "@/checkout-storefront/components";
import { useErrorMessages } from "@/checkout-storefront/hooks";

interface LineItemQuantitySelectorProps {
  line: CheckoutLineFragment;
}

export interface FormData {
  quantity: string;
}

export const SummaryItemMoneyEditableSection: React.FC<LineItemQuantitySelectorProps> = ({
  line,
}) => {
  const {
    unitPrice,
    undiscountedUnitPrice,
    variant: { pricing },
  } = line;

  const [{ fetching: updating }, updateLines] = useCheckoutLinesUpdateMutation();
  const [, deleteLines] = useCheckoutLineDeleteMutation();
  const { checkout } = useCheckout();
  const { showErrors } = useAlerts("checkoutLinesUpdate");
  const { setApiErrors, hasErrors, clearErrors } = useErrors<FormData>();
  const { errorMessages } = useErrorMessages();

  const schema = object({
    quantity: string().required(errorMessages.required),
  });

  const resolver = useValidationResolver(schema);
  const methods = useForm<FormData>({
    resolver,
    defaultValues: { quantity: line.quantity.toString() },
  });

  const { watch, setValue } = methods;

  const getQuantityValue = () => watch("quantity");
  const getQuantity = () => Number(getQuantityValue());

  const onLineQuantityUpdate = async ({ quantity }: FormData) => {
    const result = await updateLines(getUpdateLineVars({ quantity }));
    const [hasMutationErrors, errors] = extractMutationErrors(result);

    if (!hasMutationErrors) {
      clearErrors();
      return;
    }

    setApiErrors(errors);
    showErrors(errors);
  };

  const getInputProps = useGetInputProps(methods);

  const getUpdateLineVars = ({ quantity }: FormData): CheckoutLinesUpdateMutationVariables => ({
    checkoutId: checkout.id,
    lines: [
      {
        quantity: Number(quantity),
        variantId: line.variant.id,
      },
    ],
  });

  const onLineDelete = async () => {
    const result = await deleteLines({ checkoutId: checkout.id, lineId: line.id });
    const [hasMutationErrors, errors] = extractMutationErrors(result);

    if (!hasMutationErrors) {
      clearErrors();
      return;
    }

    setApiErrors(errors);
    showErrors(errors);
  };

  const piecePrice = unitPrice.gross;
  const formatMessage = useFormattedMessages();

  const multiplePieces = line.quantity > 1;

  const handleQuantityInputBlur = () => {
    if (getQuantity() === line.quantity) {
      return;
    }

    if (getQuantityValue() === "") {
      setValue("quantity", String(line.quantity));
      return;
    }

    if (getQuantity() === 0) {
      void onLineDelete();
      return;
    }

    void onLineQuantityUpdate({ quantity: getQuantityValue() });
  };

  useEffect(() => {
    if (updating || !hasErrors) {
      return;
    }

    if (line.quantity !== getQuantity()) {
      setValue("quantity", line.quantity.toString());
    }
  }, [updating]);

  return (
    <div className="flex flex-col items-end h-20 relative -top-2">
      <div className="flex flex-row items-baseline">
        <Text size="xs" className="mr-2">
          {formatMessage("quantity")}:
        </Text>
        <TextInput
          classNames={{ container: "!w-12 !mb-0", input: "text-center !h-8" }}
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
        <>
          <div className="flex flex-row justify-end mt-2">
            {pricing?.onSale && (
              <Money
                ariaLabel={formatMessage("undiscountedPriceLabel")}
                money={{
                  currency: undiscountedUnitPrice.currency,
                  amount: undiscountedUnitPrice.amount * line.quantity,
                }}
                className="line-through mr-1"
              />
            )}
            <Money
              ariaLabel={formatMessage("totalPriceLabel")}
              money={{
                currency: piecePrice?.currency as string,
                amount: (piecePrice?.amount || 0) * line.quantity,
              }}
              weight="bold"
              className={clsx({
                "!text-text-error": pricing?.onSale,
              })}
            />
          </div>
          {multiplePieces && (
            <Text
              aria-label={formatMessage("singlePiecePriceLabel")}
              size="sm"
              color="secondary"
              className="ml-4"
            >
              {`${getFormattedMoney(piecePrice)} ${formatMessage("each")}`}
            </Text>
          )}
        </>
      )}
    </div>
  );
};
