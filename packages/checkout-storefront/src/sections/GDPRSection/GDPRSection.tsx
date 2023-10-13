import React, { ChangeEvent } from "react";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { Checkbox } from "@saleor/ui-kit";
import Link from "next/link";
import usePaths from "@/checkout-storefront/lib/paths";

export function GDPRSection({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const paths = usePaths();
  const { checkout } = useCheckout();

  if (!checkout?.isShippingRequired) {
    return null;
  }

  const storefrontTerms =
    (process.env.NEXT_PUBLIC_STOREFRONT_NAME as string) === "FASHION4YOU"
      ? paths.terms_and_conditions_f4u.$url()
      : (process.env.NEXT_PUBLIC_STOREFRONT_NAME as string) === "CLOTHES4U"
      ? paths.terms_and_conditions_c4u.$url()
      : paths.terms_and_conditions_f4u.$url();

  return (
    <>
      <div data-testid="paymentMethods" style={{ margin: "16px 0" }}>
        <div className="flex gap-[0.6rem] flex-row items-start">
          <Checkbox
            name="gdprCheckbox"
            data-testid={"createAccountCheckbox"}
            classNames={{ container: "!mb-0" }}
            checked={checked}
            onChange={onChange}
          />
          <label htmlFor="gdprCheckbox">
            Potwierdzam, że zapoznałem/am się z treścią
            <Link
              href={storefrontTerms}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:cursor-pointer hover:underline"
            >
              {" "}
              regulaminu{" "}
            </Link>
            sklepu oraz akceptuję jego postanowienia.
          </label>
        </div>
      </div>
    </>
  );
}
