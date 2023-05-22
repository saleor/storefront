import { AdyenDropIn } from "@/checkout-storefront/sections/PaymentSection/AdyenDropIn/AdyenDropIn";
import { PaymentSectionSkeleton } from "@/checkout-storefront/sections/PaymentSection/PaymentSectionSkeleton";
import { usePayments } from "@/checkout-storefront/sections/PaymentSection/usePayments";
import { useCheckoutUpdateState } from "@/checkout-storefront/state/updateStateStore";

export const PaymentMethods = () => {
  const { availablePaymentGateways, fetching } = usePayments();
  const {
    changingBillingCountry,
    updateState: { checkoutDeliveryMethodUpdate },
  } = useCheckoutUpdateState();

  const { adyen } = availablePaymentGateways;

  // delivery methods change total price so we want to wait until the change is done
  if (changingBillingCountry || fetching || checkoutDeliveryMethodUpdate === "loading") {
    return <PaymentSectionSkeleton />;
  }

  return <div className="mb-3">{adyen ? <AdyenDropIn config={adyen} /> : null}</div>;
};
