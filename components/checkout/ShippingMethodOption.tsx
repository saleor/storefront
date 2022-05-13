import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";

import { translate } from "@/lib/translations";
import { DeliveryMethodFragment } from "@/saleor/api";

import { useRegions } from "../RegionsProvider";

export interface ShippingMethodOptionProps {
  method: DeliveryMethodFragment;
}

export function ShippingMethodOption({ method }: ShippingMethodOptionProps) {
  const { formatPrice } = useRegions();

  return (
    <RadioGroup.Option
      key={method.id}
      value={method}
      className={({ checked, active }) =>
        clsx(
          checked ? "border-transparent" : "border-gray-300",
          active ? "ring-1 ring-blue-500" : "",
          "bg-white border rounded shadow-sm p-4 flex cursor-pointer"
        )
      }
    >
      {({ checked, active }) => (
        <>
          <div className="flex-1 flex">
            <div className="flex flex-col">
              <RadioGroup.Label as="span" className="block text-base font-medium text-gray-900">
                {translate(method, "name")}
              </RadioGroup.Label>
              <RadioGroup.Description
                as="span"
                className="mt-1 flex items-center text-sm text-gray-500"
              >
                {method.minimumDeliveryDays || 2}-{method.maximumDeliveryDays || 14} business days
              </RadioGroup.Description>
              <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                {formatPrice(method.price)}
              </RadioGroup.Description>
            </div>
          </div>
          <div
            className={clsx(
              active ? "border" : "border-2",
              checked ? "border-blue-500" : "border-transparent",
              "absolute -inset-px rounded pointer-events-none"
            )}
            aria-hidden="true"
          />
        </>
      )}
    </RadioGroup.Option>
  );
}
