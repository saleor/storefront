import { RadioGroup } from "@headlessui/react";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "@/components/translations";
import { CheckoutDetailsFragment } from "@/saleor/api";

import { DUMMY_CREDIT_CARD_GATEWAY, DummyCreditCardSection } from "./DummyCreditCardSection";
import { STRIPE_GATEWAY, StripeCreditCardSection } from "./StripeCreditCardSection";

export interface PaymentSectionProps {
  checkout: CheckoutDetailsFragment;
  active: boolean;
}

export function PaymentSection({ checkout, active }: PaymentSectionProps) {
  const t = useIntl();
  const existingGateways = [STRIPE_GATEWAY, DUMMY_CREDIT_CARD_GATEWAY];
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
            <span className="text-gray-700">{t.formatMessage(messages.paymentInstruction)}</span>
            <RadioGroup value={chosenGateway} onChange={setChosenGateway} className="mt-2">
              {availableGateways.map((gateway) => (
                <RadioGroup.Option key={gateway.id} value={gateway.id}>
                  <label className="inline-flex items-center" htmlFor={gateway.id}>
                    <input
                      type="radio"
                      className="form-radio"
                      name="radio"
                      value={gateway.id}
                      id={gateway.id}
                    />
                    <span className="ml-2">{gateway.name}</span>
                  </label>
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          </div>
          {chosenGateway === DUMMY_CREDIT_CARD_GATEWAY && (
            <DummyCreditCardSection checkout={checkout} />
          )}
          {chosenGateway === STRIPE_GATEWAY && <StripeCreditCardSection checkout={checkout} />}
        </>
      )}
    </>
  );
}

export default PaymentSection;
