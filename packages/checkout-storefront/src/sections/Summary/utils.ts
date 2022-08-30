import { CheckoutLineFragment, OrderLineFragment } from "@/checkout-storefront/graphql";
import compact from "lodash-es/compact";

export const isCheckoutLine = (
  line: CheckoutLineFragment | OrderLineFragment
): line is CheckoutLineFragment => line.__typename === "CheckoutLine";

export const getThumbnailFromLine = (line: CheckoutLineFragment) =>
  line.variant.media?.find(({ type }) => type === "IMAGE") ||
  line.variant.product.media?.find(({ type }) => type === "IMAGE");

export const getSummaryLineProps = (line: OrderLineFragment | CheckoutLineFragment) =>
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

export const getSummaryLineAttributesText = (line: CheckoutLineFragment | OrderLineFragment) =>
  compact(
    line.variant?.attributes.reduce(
      (result: Array<string | undefined | null>, { values }) => [
        ...result,
        ...values.map(({ name }) => name),
      ],
      []
    )
  ).join(", ") || "";
