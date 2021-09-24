import { CheckoutDetailsFragment } from "@/saleor/api";
import React from "react";
import { ShippingMethodSection } from "./ShippingMethodSection";
import BillingAddressSection from "./BillingAddressSection";
import ShippingAddressSection from "./ShippingAddressSection";
import { EmailSection } from "./EmailSection";
import PaymentSection from "./payments/PaymentSection";

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

export const CheckoutForm = ({
  checkout,
}: {
  checkout?: CheckoutDetailsFragment;
}) => {
  const collapsedSections = sectionsManager(checkout);
  if (!checkout) {
    return <></>;
  }

  return (
    <section className="bg-gray-50 border-r flex-auto overflow-y-auto px-4 pt-12">
      <div className="max-w-lg mx-auto">
        <div>
          <div className="divide-y">
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
          </div>
        </div>
      </div>
    </section>
  );
};
