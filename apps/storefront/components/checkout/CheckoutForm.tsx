import React from "react";

import { CheckoutDetailsFragment } from "@/saleor/api";

import BillingAddressSection from "./BillingAddressSection";
import { EmailSection } from "./EmailSection";
import PaymentSection from "./payments/PaymentSection";
import ShippingAddressSection from "./ShippingAddressSection";
import { ShippingMethodSection } from "./ShippingMethodSection";

interface CollapsedSections {
  billingAddress: boolean;
  shippingAddress: boolean;
  shippingMethod: boolean;
  payment: boolean;
}

const sectionsManager = (
  checkout?: CheckoutDetailsFragment
): CollapsedSections => {
  // Will hide sections which cannot be set yet during the checkout
  // Start with all the sections hidden
  const state: CollapsedSections = {
    billingAddress: true,
    shippingAddress: true,
    shippingMethod: true,
    payment: true,
  };
  if (!checkout || !checkout.email) {
    return state;
  }
  state.billingAddress = false;
  if (!checkout.billingAddress) {
    return state;
  }
  state.shippingAddress = false;
  if (checkout.isShippingRequired && !checkout.shippingAddress) {
    return state;
  }
  state.shippingMethod = false;
  if (checkout.isShippingRequired && !checkout.shippingMethod) {
    return state;
  }
  state.payment = false;
  return state;
};

interface Props {
  checkout?: CheckoutDetailsFragment;
}

export const CheckoutForm = ({ checkout }: Props) => {
  const collapsedSections = sectionsManager(checkout);
  if (!checkout) {
    return <></>;
  }

  return (
    <section className="flex flex-auto flex-col overflow-y-auto px-4 pt-4 space-y-4 pb-4">
      <div className="checkout-section-container">
        <EmailSection checkout={checkout} />
      </div>
      <div className="checkout-section-container">
        <BillingAddressSection
          active={!collapsedSections.billingAddress}
          checkout={checkout}
        />
      </div>

      {checkout.isShippingRequired && (
        <div className="checkout-section-container">
          <ShippingAddressSection
            active={!collapsedSections.shippingAddress}
            checkout={checkout}
          />
        </div>
      )}
      {checkout.isShippingRequired && (
        <div className="checkout-section-container">
          <ShippingMethodSection
            active={!collapsedSections.shippingMethod}
            checkout={checkout}
          />
        </div>
      )}
      <div className="checkout-section-container">
        <PaymentSection
          active={!collapsedSections.payment}
          checkout={checkout}
        />
      </div>
    </section>
  );
};
