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

import { getTaxPercentage } from "./utils";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { Title } from "@/checkout-storefront/components/Title";
import { useFormattedMoney } from "@/checkout-storefront/hooks/useFormattedMoney";

export const Summary = () => {
  const [isOpen, setOpen] = useState(true);
  const { checkout } = useCheckout();

  const formatMessage = useFormattedMessages();

  const totalPrice = checkout?.totalPrice?.gross;
  const taxCost = checkout?.totalPrice?.tax;
  const formattedTaxCost = useFormattedMoney(taxCost);

  return (
    <div className="summary">
      <div className={clsx("summary-title", isOpen && "open")}>
        <div
          className="flex flex-row items-center"
          onClick={() => setOpen(!isOpen)}
        >
          <Title className="mb-0">{formatMessage("summary")}</Title>
          <img src={getSvgSrc(ChevronDownIcon)} alt="chevron-down" />
        </div>
        {!isOpen && (
          <Money
            ariaLabel={formatMessage("totalPriceLabel")}
            weight="bold"
            money={totalPrice}
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
        {/* <div className="w-full h-2" /> */}
        <ul className="summary-items">
          {compact(checkout?.lines)?.map((line) => (
            <SummaryItem line={line} key={line?.id} />
          ))}
        </ul>
        <div className="summary-recap">
          <Divider className="my-4" />
          <div className="summary-row mb-2">
            <Text color="secondary">{formatMessage("subtotal")}</Text>
            <Money
              color="secondary"
              ariaLabel={formatMessage("subtotalLabel")}
              money={checkout?.subtotalPrice?.gross}
            />
          </div>
          <div className="summary-row">
            <Text color="secondary">{formatMessage("shippingCost")}</Text>
            <Money
              ariaLabel={formatMessage("shippingCostLabel")}
              color="secondary"
              money={checkout?.shippingPrice?.gross}
            />
          </div>
          <div className="summary-row"></div>
          <Divider className="my-4" />
          <div className="summary-row pb-4 items-baseline">
            <div className="flex flex-row items-baseline">
              <Text weight="bold">{formatMessage("total")}</Text>
              {
                <Text color="secondary" className="ml-2">
                  {formatMessage("taxCost", {
                    taxCost: formattedTaxCost,
                  })}
                </Text>
              }
            </div>
            <Money
              ariaLabel={formatMessage("totalLabel")}
              weight="bold"
              money={totalPrice}
            />
          </div>
        </div>
      </Transition>
    </div>
  );
};
