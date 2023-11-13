import { RadioGroup } from "@headlessui/react";
import React, { useState } from "react";
import { PaymentMethodProps } from "@/checkout-storefront/lib/globalTypes";

import PayuSection, { PAYU_GATEWAY } from "./PayuSection";
import CodSection, { COD_GATEWAY } from "./CodSection";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useIntl } from "react-intl";
import { paymentSectionMessages } from "./messages";

export const PaymentMethods: React.FC<PaymentMethodProps> = ({
  isOnReceiveSelected,
  isLockerIdSelected,
}) => {
  const { checkout } = useCheckout();
  const t = useIntl();
  const [chosenGateway, setChosenGateway] = useState("");
  const existingGateways: string[] = [];
  if (isOnReceiveSelected) {
    existingGateways.push(COD_GATEWAY);
  } else {
    existingGateways.push(PAYU_GATEWAY);
  }

  const availableGateways = checkout.availablePaymentGateways.filter((g) =>
    existingGateways.includes(g.id)
  );

  return (
    <>
      <div className="block">
        <RadioGroup value={chosenGateway} onChange={setChosenGateway} className="mt-2 w-max">
          {availableGateways?.map(({ id, name }) => (
            <RadioGroup.Option key={id} value={id}>
              <label
                className="inline-flex items-center mb-4 text-base font-medium text-gray-900 cursor-pointer border-gray-300 bg-white border rounded shadow-sm p-4 hover:border-brand transition"
                htmlFor={id}
              >
                <input type="radio" className="form-radio" name="radio" value={id} id={id} />
                {name === "Cod" && (
                  <span>{t.formatMessage(paymentSectionMessages.payOnDelivery)}</span>
                )}
                {name !== "Cod" && <span className="">{name}</span>}
              </label>
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </div>
      {chosenGateway === PAYU_GATEWAY && (
        <PayuSection checkout={checkout} isLockerIdSelected={isLockerIdSelected} />
      )}
      {chosenGateway === COD_GATEWAY && <CodSection checkout={checkout} />}
    </>
  );
};

export default PaymentMethods;
