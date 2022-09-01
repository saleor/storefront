import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { Contact } from "@/checkout-storefront/sections/Contact";
import { DeliveryMethods } from "@/checkout-storefront/sections/DeliveryMethods";
import { Suspense, useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { Button } from "@/checkout-storefront/components/Button";
import { useCheckoutFinalize } from "./useCheckoutFinalize";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useAuthState } from "@saleor/sdk";
import { PaymentSection } from "../PaymentSection";
import { ShippingAddressSection } from "../Addresses/ShippingAddressSection";
import { ContactSkeleton } from "@/checkout-storefront/sections/Contact/ContactSkeleton";
import { DeliveryMethodsSkeleton } from "@/checkout-storefront/sections/DeliveryMethods/DeliveryMethodsSkeleton";
import { AddressSectionSkeleton } from "@/checkout-storefront/sections/Addresses/AddressSectionSkeleton";
import { useCheckoutForm } from "@/checkout-storefront/sections/CheckoutForm/useCheckoutForm";

export const CheckoutForm = () => {
  const formatMessage = useFormattedMessages();
  const { checkout, loading } = useCheckout();
  const { authenticating } = useAuthState();
  const { checkoutFinalize, errors: userRegisterErrors } = useCheckoutFinalize();

  const isLoading = loading || authenticating;
  const [showOnlyContact, setShowOnlyContact] = useState(false);
  const { ensureValidCheckout, getFormData, usePaymentProvidersProps, methods } = useCheckoutForm({
    userRegisterErrors,
  });
  const [isProcessingApiChanges, setIsProcessingApiChanges] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const hasFinishedApiChanges = !Object.values(methods.watch("updateState")).some((value) => value);

  useEffect(() => {
    if (!hasFinishedApiChanges) {
      return;
    }

    setIsProcessingApiChanges(false);

    if (submitInProgress) {
      handleSubmit();
    }
  }, [hasFinishedApiChanges]);

  // not using form handleSubmit on purpose
  const handleSubmit = () => {
    if (!hasFinishedApiChanges) {
      setIsProcessingApiChanges(true);
      setSubmitInProgress(true);
      return;
    }

    setSubmitInProgress(false);
    if (!ensureValidCheckout()) {
      return;
    }

    void checkoutFinalize(getFormData());
  };

  console.log("YOO");
  return (
    <div className="checkout-form-container">
      <div className="checkout-form">
        <FormProvider {...methods}>
          <Suspense fallback={<ContactSkeleton />}>
            <Contact setShowOnlyContact={setShowOnlyContact} />
          </Suspense>
          <>
            {checkout?.isShippingRequired && (
              <Suspense fallback={<AddressSectionSkeleton />}>
                <ShippingAddressSection collapsed={showOnlyContact} />
              </Suspense>
            )}
            <Suspense fallback={<DeliveryMethodsSkeleton />}>
              <DeliveryMethods collapsed={showOnlyContact} />
            </Suspense>
            <PaymentSection {...usePaymentProvidersProps} collapsed={showOnlyContact} />
          </>
        </FormProvider>
      </div>
      {!showOnlyContact &&
        (isProcessingApiChanges ? (
          <Button
            className="pay-button"
            disabled
            ariaLabel={formatMessage("saveLabel")}
            label={formatMessage("processing")}
          />
        ) : (
          <Button
            disabled={isLoading}
            ariaLabel={formatMessage("finalizeCheckoutLabel")}
            label={formatMessage("pay")}
            className="pay-button"
            onClick={handleSubmit}
          />
        ))}
    </div>
  );
};
