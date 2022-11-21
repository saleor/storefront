import React, { FC, useEffect, useRef, useState } from "react";
import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { SummaryItem, SummaryLine } from "./SummaryItem";
import { ChevronDownIcon } from "@/checkout-storefront/icons";
import { Transition } from "@headlessui/react";
import clsx from "clsx";

import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { PromoCodeAdd } from "./PromoCodeAdd";
import { SummaryMoneyRow } from "./SummaryMoneyRow";
import { SummaryPromoCodeRow } from "./SummaryPromoCodeRow";
import { SummaryItemMoneyEditableSection } from "./SummaryItemMoneyEditableSection";
import { getFormattedMoney } from "@/checkout-storefront/lib/utils";
import { Divider, Money, Title } from "@/checkout-storefront/components";
import {
  CheckoutLineFragment,
  GiftCardFragment,
  Money as MoneyType,
  OrderLineFragment,
} from "@/checkout-storefront/graphql";
import { SummaryItemMoneySection } from "@/checkout-storefront/sections/Summary/SummaryItemMoneySection";
import { GrossMoney, GrossMoneyWithTax } from "@/checkout-storefront/lib/globalTypes";
import { summaryLabels, summaryMessages } from "./messages";

/* temporary solution */
const PAGE_MARGINS_HEIGHT = 320;
const LINE_HEIGHT = 104;
const LG_BREAKPOINT = 1024;

interface SummaryProps {
  editable?: boolean;
  lines: SummaryLine[];
  totalPrice?: GrossMoneyWithTax;
  subtotalPrice?: GrossMoney;
  giftCards?: GiftCardFragment[];
  voucherCode?: string | null;
  discount?: MoneyType | null;
  shippingPrice: GrossMoney;
}

export const Summary: FC<SummaryProps> = ({
  editable = true,
  lines,
  totalPrice,
  subtotalPrice,
  giftCards = [],
  voucherCode,
  shippingPrice,
  discount,
}) => {
  const [isOpen, setOpen] = useState(true);
  const recapRef = useRef<HTMLDivElement>(null);
  const [maxSummaryHeight, setMaxSummaryHeight] = useState<number>(0);

  const formatMessage = useFormattedMessages();

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

      // always set at least one line item height
      setMaxSummaryHeight(Math.max(LINE_HEIGHT, maxHeight));
    };

    window.addEventListener("resize", handleWindowResize, { passive: true });
    handleWindowResize();

    return () => window.removeEventListener("resize", handleWindowResize);
  }, [recapRef, lines.length]);

  return (
    <div className="summary">
      <div className={clsx("summary-title", isOpen && "open")}>
        <div className="flex flex-row items-center w-full" onClick={() => setOpen(!isOpen)}>
          <Title className="mb-0">{formatMessage(summaryMessages.title)}</Title>
          <img src={getSvgSrc(ChevronDownIcon)} alt="chevron-down" />
        </div>
        {!isOpen && (
          <Money
            ariaLabel={formatMessage(summaryLabels.totalPrice)}
            weight="bold"
            money={totalPrice?.gross}
          />
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
          style={{ maxHeight: maxSummaryHeight ? `${maxSummaryHeight}px` : "" }}
          className={clsx(
            "summary-items",
            lines.length * LINE_HEIGHT > maxSummaryHeight ? "border-b border-border-secondary" : ""
          )}
        >
          {lines.map((line) => (
            <SummaryItem line={line} key={line?.id}>
              {editable ? (
                <SummaryItemMoneyEditableSection line={line as CheckoutLineFragment} />
              ) : (
                <SummaryItemMoneySection line={line as OrderLineFragment} />
              )}
            </SummaryItem>
          ))}
        </ul>
        {editable && <PromoCodeAdd />}
        <div className="summary-recap" ref={recapRef}>
          <Divider className="mt-1 mb-4" />
          <SummaryMoneyRow
            label={formatMessage(summaryMessages.subtotalPrice)}
            money={subtotalPrice?.gross}
            ariaLabel={formatMessage(summaryLabels.subtotalPrice)}
          />
          {voucherCode && (
            <SummaryPromoCodeRow
              editable={editable}
              promoCode={voucherCode}
              ariaLabel={formatMessage(summaryLabels.voucher)}
              label={formatMessage(summaryMessages.voucher, { voucherCode })}
              money={discount}
              negative
            />
          )}
          {giftCards.map(({ currentBalance, displayCode, id }) => (
            <SummaryPromoCodeRow
              editable={editable}
              promoCodeId={id}
              ariaLabel={formatMessage(summaryLabels.giftCard)}
              label={formatMessage(summaryMessages.giftCard, {
                giftCardCode: `•••• •••• ${displayCode}`,
              })}
              money={currentBalance}
              negative
            />
          ))}
          <SummaryMoneyRow
            label={formatMessage(summaryMessages.shippingCost)}
            ariaLabel={formatMessage(summaryLabels.shippingCost)}
            money={shippingPrice?.gross}
          />
          <Divider className="my-4" />
          <div className="summary-row pb-4 items-baseline">
            <div className="flex flex-row items-baseline">
              <Text weight="bold">{formatMessage(summaryMessages.totalPrice)}</Text>
              <Text color="secondary" className="ml-2">
                {formatMessage(summaryMessages.taxCost, {
                  taxCost: getFormattedMoney(totalPrice?.tax),
                })}
              </Text>
            </div>
            <Money
              ariaLabel={formatMessage(summaryLabels.totalPrice)}
              weight="bold"
              money={totalPrice?.gross}
              data-testid="totalOrderPrice"
            />
          </div>
        </div>
      </Transition>
    </div>
  );
};
