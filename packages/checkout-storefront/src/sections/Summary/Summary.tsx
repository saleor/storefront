import React, { useEffect, useRef, useState } from "react";
import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { SummaryItem } from "./SummaryItem";
import { ChevronDownIcon } from "@/checkout-storefront/icons";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";

import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { PromoCodeAdd } from "./PromoCodeAdd";
import { SummaryMoneyRow } from "./SummaryMoneyRow";
import { SummaryPromoCodeRow } from "./SummaryPromoCodeRow";
import { SummaryItemMoneyEditableSection } from "./SummaryItemMoneyEditableSection";
import { getFormattedMoney } from "@/checkout-storefront/lib/utils";
import { Divider, Money, Title } from "@/checkout-storefront/components";

/* temporary solution */
const PAGE_MARGINS_HEIGHT = 320;
const LINE_HEIGHT = 104;
const LG_BREAKPOINT = 1024;

export const Summary = () => {
  const [isOpen, setOpen] = useState(true);
  const { checkout } = useCheckout();
  const { voucherCode, discount } = checkout;
  const recapRef = useRef<HTMLDivElement>(null);
  const [maxSummaryHeight, setMaxSummaryHeight] = useState<number>(0);

  const formatMessage = useFormattedMessages();

  const totalPrice = checkout?.totalPrice?.gross;
  const taxCost = checkout?.totalPrice?.tax;

  const lines = checkout?.lines;

  useEffect(() => {
    const handleWindowResize = () => {
      const isLg = window.innerWidth > LG_BREAKPOINT;

      if (isLg) {
        setOpen(true);
      }

      if (!recapRef.current) {
        return;
      }

      const recapHeight = recapRef.current.clientHeight;

      const maxHeight = isLg
        ? window.innerHeight - PAGE_MARGINS_HEIGHT - recapHeight
        : lines.length * LINE_HEIGHT;

      setMaxSummaryHeight(maxHeight);
    };

    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();

    return () => window.removeEventListener("resize", handleWindowResize);
  }, [recapRef]);

  return (
    <div className="summary">
      <div className={clsx("summary-title", isOpen && "open")}>
        <div className="flex flex-row items-center w-full" onClick={() => setOpen(!isOpen)}>
          <Title className="mb-0">{formatMessage("summary")}</Title>
          <img src={getSvgSrc(ChevronDownIcon)} alt="chevron-down" />
        </div>
        {!isOpen && (
          <Money ariaLabel={formatMessage("totalPriceLabel")} weight="bold" money={totalPrice} />
        )}
      </div>
      <Transition
        show={isOpen}
        unmount={false}
        enter="transition duration-300 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <ul
          className="summary-items"
          style={{ maxHeight: maxSummaryHeight ? `${maxSummaryHeight}px` : "" }}
        >
          {lines.map((line) => (
            <SummaryItem line={line} key={line?.id}>
              <SummaryItemMoneyEditableSection line={line} />
            </SummaryItem>
          ))}
        </ul>
        <PromoCodeAdd
          className={clsx(
            lines.length * LINE_HEIGHT > maxSummaryHeight ? "border-t border-border-secondary" : ""
          )}
        />
        <div className="summary-recap" ref={recapRef}>
          <Divider className="mt-1 mb-4" />
          <SummaryMoneyRow
            label={formatMessage("subtotal")}
            money={checkout?.subtotalPrice?.gross}
            ariaLabel={formatMessage("subtotalLabel")}
          />
          {voucherCode && (
            <SummaryPromoCodeRow
              promoCode={voucherCode}
              ariaLabel={formatMessage("voucherLabel")}
              label={formatMessage("voucher", { voucherCode })}
              money={discount}
              negative
            />
          )}
          {checkout.giftCards.map(({ currentBalance, displayCode, id }) => (
            <SummaryPromoCodeRow
              promoCodeId={id}
              ariaLabel={formatMessage("giftCardLabel")}
              label={formatMessage("giftCard", { giftCardCode: `•••• •••• ${displayCode}` })}
              money={currentBalance}
              negative
            />
          ))}
          <SummaryMoneyRow
            label={formatMessage("shippingCost")}
            ariaLabel={formatMessage("shippingCostLabel")}
            money={checkout?.shippingPrice?.gross}
          />
          <Divider className="my-4" />
          <div className="summary-row pb-4 items-baseline">
            <div className="flex flex-row items-baseline">
              <Text weight="bold">{formatMessage("total")}</Text>
              {
                <Text color="secondary" className="ml-2">
                  {formatMessage("taxCost", {
                    taxCost: getFormattedMoney(taxCost),
                  })}
                </Text>
              }
            </div>
            <Money ariaLabel={formatMessage("totalLabel")} weight="bold" money={totalPrice} />
          </div>
        </div>
      </Transition>
    </div>
  );
};
