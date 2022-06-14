import {
  CheckoutLineFragment,
  Money,
  OrderLineFragment,
} from "@/checkout/graphql";

export const getTaxPercentage = (taxCost: Money, totalPrice: Money): string => {
  if (!totalPrice?.amount || !taxCost?.amount) {
    return (0).toFixed(2);
  }

  return (taxCost.amount / totalPrice.amount).toFixed(2);
};

export const isCheckoutLine = (
  line: CheckoutLineFragment | OrderLineFragment
): line is CheckoutLineFragment => line.__typename === "CheckoutLine";

export const getThumbnailFromLine = (line: CheckoutLineFragment) =>
  line.variant.media?.find(({ type }) => type === "IMAGE") ||
  line.variant.product.media?.find(({ type }) => type === "IMAGE");

export const getSummaryLineProps = (
  line: OrderLineFragment | CheckoutLineFragment
) =>
  isCheckoutLine(line)
    ? {
        variantName: line.variant.name,
        productName: line.variant.product.name,
        productImage: getThumbnailFromLine(line),
      }
    : {
        variantName: line.variantName,
        productName: line.productName,
        productImage: line.thumbnail,
      };
