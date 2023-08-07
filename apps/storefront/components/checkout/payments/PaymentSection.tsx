import { RadioGroup } from "@headlessui/react";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "@/components/translations";
import { CheckoutDetailsFragment } from "@/saleor/api";
import PayuSection, { PAYU_GATEWAY } from "./PayuSection";

// import { DUMMY_CREDIT_CARD_GATEWAY, DummyCreditCardSection } from "./DummyCreditCardSection";
// import { STRIPE_GATEWAY, StripeCreditCardSection } from "./StripeCreditCardSection";
// import PayuSection from "./PayuSection";
// import { useCheckout } from "@/lib/providers/CheckoutProvider";

export interface IPaymentGatewayConfig {
  field: string;
  value: string | null;
}

export interface PaymentSectionProps {
  checkout: CheckoutDetailsFragment;
  active: boolean;
  config?: IPaymentGatewayConfig[];
}
export function PaymentSection({ checkout, active }: PaymentSectionProps) {
  const t = useIntl();
  const existingGateways = [PAYU_GATEWAY];
  const availableGateways = checkout.availablePaymentGateways.filter((g) =>
    existingGateways.includes(g.id)
  );

  const [chosenGateway, setChosenGateway] = useState("");

  return (
    <>
      <div className="mt-4 mb-4">
        <h2
          className={active ? "checkout-section-header-active" : "checkout-section-header-disabled"}
        >
          {t.formatMessage(messages.paymentCardHeader)}
        </h2>
      </div>
      {active && (
        <>
          <div className="block">
            <span className="text-gray-700 text-base">
              {t.formatMessage(messages.paymentInstruction)}
            </span>
            <RadioGroup value={chosenGateway} onChange={setChosenGateway} className="mt-2 w-max">
              {availableGateways.map(({ id, name }) => (
                <RadioGroup.Option key={id} value={id}>
                  <label
                    className="inline-flex items-center mt-6 text-base font-medium text-gray-900 cursor-pointer border-gray-300 bg-white border rounded shadow-sm p-4 hover:border-brand transition"
                    htmlFor={id}
                  >
                    <input type="radio" className="form-radio" name="radio" value={id} id={id} />
                    <span className="">{name}</span>
                  </label>
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          </div>
          {/* {chosenGateway === DUMMY_CREDIT_CARD_GATEWAY && (
            <DummyCreditCardSection checkout={checkout} />
          )}
          {chosenGateway === STRIPE_GATEWAY && <StripeCreditCardSection checkout={checkout} />} */}
          {chosenGateway === PAYU_GATEWAY && <PayuSection checkout={checkout} />}
        </>
      )}
    </>
  );
}

export default PaymentSection;
