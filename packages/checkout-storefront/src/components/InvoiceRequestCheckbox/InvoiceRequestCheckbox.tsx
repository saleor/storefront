import { useUpdateCheckoutMetadataMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { Checkbox } from "@saleor/ui-kit";
import { useState } from "react";

interface InvoiceRequestCheckboxProps {
  onInvoiceChange: (invoice: boolean) => void;
}

export const InvoiceRequestCheckbox = ({ onInvoiceChange }: InvoiceRequestCheckboxProps) => {
  const [isInvoice, setIsInvoice] = useState<boolean>(false);
  const [, updateCheckoutMetadata] = useUpdateCheckoutMetadataMutation();
  const { checkout } = useCheckout();

  const handleInvoiceChange = async (invoice: boolean) => {
    setIsInvoice(invoice);
    onInvoiceChange(invoice);

    const invoiceStr = invoice ? "true" : "false";

    await updateCheckoutMetadata({
      checkoutId: checkout?.id ?? "",
      isInvoice: invoiceStr,
    });
  };

  return (
    <Checkbox
      name="vatID"
      label="Czy chcesz otrzymać fakturę VAT?"
      data-testid={"vatIdCheckbox"}
      classNames={{ container: "!mb-0" }}
      checked={isInvoice}
      onChange={() => handleInvoiceChange(!isInvoice)}
    />
  );
};
