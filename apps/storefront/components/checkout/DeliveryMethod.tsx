import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { RadioGroup } from "@headlessui/react";
import {
  DeliveryMethodFragment,
  useCheckoutShippingMethodUpdateMutation,
} from "@/saleor/api";
import { useLocalStorage } from "react-use";
import { Button } from "../Button";
import { formatAsMoney } from "@/lib/util";
import { CHECKOUT_TOKEN } from "@/lib/const";

export const DeliveryMethod = ({
  collection,
  checkoutDeliveryMethod,
}: {
  collection: Array<any>;
  checkoutDeliveryMethod?: DeliveryMethodFragment;
}) => {
  const [token] = useLocalStorage(CHECKOUT_TOKEN);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    checkoutDeliveryMethod
  );
  const [checkoutShippingMethodUpdate] =
    useCheckoutShippingMethodUpdateMutation({});

  const [changeDeliveryMethod, setChangeDeliveryMethod] = useState(
    !checkoutDeliveryMethod
  );

  const handleChange = async (method: any) => {
    console.log("DeliveryMethod.handleChange", method);

    const r = await checkoutShippingMethodUpdate({
      variables: {
        token,
        shippingMethodId: method.id,
      },
    });

    setSelectedDeliveryMethod(method);
    setChangeDeliveryMethod(false);
  };

  return (
    <>
      {!changeDeliveryMethod ? (
        <div className="flex justify-between items-center">
          <div>
            <div className="mt-6 text-sm font-medium text-gray-900">
              {checkoutDeliveryMethod?.name}
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              {checkoutDeliveryMethod?.minimumDeliveryDays || 2}-
              {checkoutDeliveryMethod?.maximumDeliveryDays || 14} business days
            </div>
            <div className="mt-6 text-sm font-medium text-gray-900">
              {formatAsMoney(
                checkoutDeliveryMethod?.price?.amount,
                checkoutDeliveryMethod?.price?.currency
              )}
            </div>
          </div>
          <Button onClick={() => setChangeDeliveryMethod(true)}>Change</Button>
        </div>
      ) : (
        <RadioGroup
          value={selectedDeliveryMethod}
          onChange={handleChange}
          className="py-8"
        >
          <div className="mt-4 grid grid-cols-2 gap-2">
            {collection.map((deliveryMethod) => (
              <RadioGroup.Option
                key={deliveryMethod.id}
                value={deliveryMethod}
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
                        <RadioGroup.Label
                          as="span"
                          className="block text-sm font-medium text-gray-900"
                        >
                          {deliveryMethod.name}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="span"
                          className="mt-1 flex items-center text-sm text-gray-500"
                        >
                          {deliveryMethod.minimumDeliveryDays || 2}-
                          {deliveryMethod.maximumDeliveryDays || 14} business
                          days
                        </RadioGroup.Description>
                        <RadioGroup.Description
                          as="span"
                          className="mt-6 text-sm font-medium text-gray-900"
                        >
                          {formatAsMoney(
                            deliveryMethod.price.amount,
                            deliveryMethod.price.currency
                          )}
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
            ))}
          </div>
        </RadioGroup>
      )}
    </>
  );
};
