import { RadioGroup } from "@headlessui/react";
import React, { useState } from "react";

import PayuSection, { PAYU_GATEWAY } from "./PayuSection";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import PickupSection, { PICKUP_GATEWAY } from "./PickupSection";

interface PaymentMethodsProps {
  selectedCourier: string;
}

export function PaymentMethods({ selectedCourier }: PaymentMethodsProps) {
  const { checkout } = useCheckout();
  const [chosenGateway, setChosenGateway] = useState("");
  // const existingGateways = [PAYU_GATEWAY, PICKUP_GATEWAY];
  let availableGateways = checkout.availablePaymentGateways;

  if (selectedCourier === "Kurier pobranie, GLS") {
    availableGateways = availableGateways.filter((gateway) => gateway.id === PICKUP_GATEWAY);
  } else {
    availableGateways = availableGateways.filter((gateway) => gateway.id === PAYU_GATEWAY);
  }

  return (
    <div className="block">
      <RadioGroup value={chosenGateway} onChange={setChosenGateway} className="mt-2 w-max">
        {availableGateways?.map(({ id, name }) => (
          <RadioGroup.Option key={id} value={id}>
            <label
              className="inline-flex items-center mb-4 text-base font-medium text-gray-900 cursor-pointer border-gray-300 bg-white border rounded shadow-sm p-4 hover:border-brand transition"
              htmlFor={id}
            >
              <input type="radio" className="form-radio" name="radio" value={id} id={id} />
              <span className="">{name}</span>
            </label>
          </RadioGroup.Option>
        ))}
      </RadioGroup>
      {chosenGateway === PAYU_GATEWAY && <PayuSection checkout={checkout} />}
      {chosenGateway === PICKUP_GATEWAY && <PickupSection checkout={checkout} />}
    </div>
  );
}

export default PaymentMethods;
