import React from "react";
import { Checkbox } from "@saleor/ui-kit";

interface InvoiceRequestCheckboxProps {
  isInvoice: boolean;
  onInvoiceChange: (invoice: boolean) => void;
}

const InvoiceRequestCheckbox = ({ isInvoice, onInvoiceChange }: InvoiceRequestCheckboxProps) => {
  return (
    <Checkbox
      name="vatID"
      label="Czy chcesz otrzymać fakturę VAT?"
      data-testid={"vatIdCheckbox"}
      classNames={{ container: "!mb-0" }}
      checked={isInvoice}
      onChange={() => onInvoiceChange(!isInvoice)}
    />
  );
};

export default InvoiceRequestCheckbox;
