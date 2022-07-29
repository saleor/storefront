import clsx from "clsx";
import { Text } from "@saleor/ui-kit";
import {
  CheckoutLineFragment,
  CheckoutLinesUpdateMutationVariables,
  useCheckoutLinesUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useFormattedMoney } from "@/checkout-storefront/hooks/useFormattedMoney";
import { Money } from "@/checkout-storefront/components/Money";
import { TextInput } from "@/checkout-storefront/components/TextInput";

import { useEffect } from "react";
import {
  extractMutationErrors,
  useValidationResolver,
} from "@/checkout-storefront/lib/utils";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";

interface LineItemQuantitySelectorProps {
  line: CheckoutLineFragment;
}

export interface FormData {
  quantity: string;
}

export const SummaryItemMoneyEditableSection: React.FC<
  LineItemQuantitySelectorProps
> = ({ line }) => {
  const {
    unitPrice,
    undiscountedUnitPrice,
    variant: { pricing },
  } = line;

  const [{ fetching }, updateLines] = useCheckoutLinesUpdateMutation();
  const { checkout } = useCheckout();
  const { showErrors } = useAlerts("checkoutLinesUpdate");
  const { setApiErrors, hasErrors, clearErrors } = useErrors<FormData>();

  const schema = object({
    quantity: string(),
  });

  const resolver = useValidationResolver(schema);
  const methods = useForm<FormData>({
    resolver,
    defaultValues: { quantity: line.quantity.toString() },
  });

  const { watch, setValue } = methods;

  const getQuantityValue = () => watch("quantity");
  const getQuantity = () => Number(getQuantityValue());

  const onSubmit = async ({ quantity }: FormData) => {
    const result = await updateLines(getUpdateLineVars({ quantity }));
    const [hasMutationErrors, errors] = extractMutationErrors(result);

    if (!hasMutationErrors) {
      clearErrors();
      return;
    }

    setApiErrors(errors);
    showErrors(errors);
  };

  //@ts-ignore
  const getInputProps = useGetInputProps(methods);

  const getUpdateLineVars = ({
    quantity,
  }: FormData): CheckoutLinesUpdateMutationVariables => ({
    checkoutId: checkout.id,
    lines: [
      {
        quantity: Number(quantity),
        variantId: line.variant.id,
      },
    ],
  });

  const piecePrice = unitPrice.gross;
  const formatMessage = useFormattedMessages();
  const formattedPiecePrice = useFormattedMoney(piecePrice);

  const multiplePieces = getQuantity() > 1;

  const handleQuantityInputBlur = () => {
    if (getQuantity() === line.quantity) {
      return;
    }

    if (getQuantityValue() === "") {
      setValue("quantity", String(line.quantity));
      return;
    }

    void onSubmit({ quantity: getQuantityValue() });
  };

  useEffect(() => {
    if (fetching || !hasErrors) {
      return;
    }

    if (line.quantity !== getQuantity()) {
      setValue("quantity", line.quantity.toString());
    }
  }, [fetching]);

  return (
    <div className="flex flex-col items-end h-20">
      <div className="flex flex-row">
        <TextInput
          classNames={{ container: "max-w-12 !mb-2", input: "text-right !h-8" }}
          label=""
          {...getInputProps("quantity", { onBlur: handleQuantityInputBlur })}
        />
      </div>
      <div className="flex flex-row justify-end">
        {pricing?.onSale && (
          <Money
            ariaLabel={formatMessage("undiscountedPriceLabel")}
            money={{
              currency: undiscountedUnitPrice.currency,
              amount: undiscountedUnitPrice.amount * getQuantity(),
            }}
            className="line-through mr-1"
          />
        )}
        <Money
          ariaLabel={formatMessage("totalPriceLabel")}
          money={{
            currency: piecePrice?.currency as string,
            amount: (piecePrice?.amount || 0) * getQuantity(),
          }}
          weight="bold"
          className={clsx({
            "text-text-error": pricing?.onSale,
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
          {`${formattedPiecePrice} ${formatMessage("each")}`}
        </Text>
      )}
    </div>
  );
};
