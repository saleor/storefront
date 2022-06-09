import React, { useState } from "react";
import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { SummaryItem } from "./SummaryItem";
import { Divider } from "@/checkout/components/Divider";
import { Money } from "@/checkout/components/Money";
import { ChevronDownIcon } from "@/checkout/icons";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { compact } from "lodash-es";
import "./SummaryStyles.css";

import { getTaxPercentage } from "./utils";

export const Summary = () => {
  const [isOpen, setOpen] = useState(true);
  const { checkout } = useCheckout();

  const formatMessage = useFormattedMessages();

  const totalPrice = checkout?.totalPrice?.gross;
  const taxCost = checkout?.totalPrice?.tax;
  const taxPercentage = getTaxPercentage(taxCost, totalPrice);

  return (
    <div className="summary">
      <div className={clsx("summary-title", isOpen && "open")}>
        <div className="flex flex-row items-center">
          <Text size="lg" weight="bold">
            {formatMessage("summary")}
          </Text>
          <img
            src={ChevronDownIcon}
            alt="chevron-down"
            onClick={() => setOpen(!isOpen)}
          />
        </div>
        <Money
          ariaLabel={formatMessage("totalPriceLabel")}
          weight="bold"
          money={totalPrice}
        />
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
        <div className="w-full h-12" />
        <ul className="summary-items">
          {compact(checkout?.lines)?.map((line) => (
            <SummaryItem line={line} key={line?.id} />
          ))}
        </ul>
        <div className="summary-recap">
          <div className="summary-row">
            <Text weight="bold">{formatMessage("subtotal")}</Text>
            <Money
              ariaLabel={formatMessage("subtotalLabel")}
              weight="bold"
              money={checkout?.subtotalPrice?.gross}
            />
          </div>
          <Divider className="my-4" />
          <div className="summary-row mb-2">
            <Text color="secondary">{formatMessage("shippingCost")}</Text>
            <Money
              ariaLabel={formatMessage("shippingCostLabel")}
              color="secondary"
              money={checkout?.shippingPrice?.gross}
            />
          </div>
          <div className="summary-row">
            <Text color="secondary">
              {formatMessage("taxCost", {
                taxPercentage,
              })}
            </Text>
            <Money
              ariaLabel={formatMessage("taxCostLabel")}
              color="secondary"
              money={taxCost}
            />
          </div>
          <Divider className="my-4" />
          <div className="summary-row">
            <Text size="md" weight="bold">
              {formatMessage("total")}
            </Text>
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
