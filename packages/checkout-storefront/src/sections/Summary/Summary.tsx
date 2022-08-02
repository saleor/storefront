import React, { useState } from "react";
import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { SummaryItem } from "./SummaryItem";
import { Divider } from "@/checkout-storefront/components/Divider";
import { Money } from "@/checkout-storefront/components/Money";
import { ChevronDownIcon } from "@/checkout-storefront/icons";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { compact } from "lodash-es";

import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { Title } from "@/checkout-storefront/components/Title";
import { PromoCodeAdd } from "./PromoCodeAdd";
import { SummaryMoneyRow } from "./SummaryMoneyRow";
import { SummaryPromoCodeRow } from "./SummaryPromoCodeRow";
import { SummaryItemMoneyEditableSection } from "./SummaryItemMoneyEditableSection";
import { getFormattedMoney } from "@/checkout-storefront/lib/utils";

export const Summary = () => {
  const [isOpen, setOpen] = useState(true);
  const { checkout } = useCheckout();
  const { voucherCode, discount } = checkout;

  const formatMessage = useFormattedMessages();

  const totalPrice = checkout?.totalPrice?.gross;
  const taxCost = checkout?.totalPrice?.tax;

  return (
    <div className="summary">
      <div className={clsx("summary-title", isOpen && "open")}>
        <div className="flex flex-row items-center" onClick={() => setOpen(!isOpen)}>
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
        <ul className="summary-items">
          {compact(checkout?.lines)?.map((line) => (
            <SummaryItem line={line} key={line?.id}>
              <SummaryItemMoneyEditableSection line={line} />
            </SummaryItem>
          ))}
        </ul>
        <PromoCodeAdd />
        <div className="summary-recap">
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
