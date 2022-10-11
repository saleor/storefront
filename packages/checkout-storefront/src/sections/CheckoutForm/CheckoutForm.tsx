import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { Contact } from "@/checkout-storefront/sections/Contact";
import { DeliveryMethods } from "@/checkout-storefront/sections/DeliveryMethods";
import { Suspense, useState } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { Button } from "@/checkout-storefront/components/Button";
import { useCheckoutFinalize } from "./useCheckoutFinalize";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useAuthState } from "@saleor/sdk";
import { PaymentSection } from "../PaymentSection";
import { ShippingAddressSection } from "../ShippingAddressSection/ShippingAddressSection";
import { ContactSkeleton } from "@/checkout-storefront/sections/Contact/ContactSkeleton";
import { DeliveryMethodsSkeleton } from "@/checkout-storefront/sections/DeliveryMethods/DeliveryMethodsSkeleton";
import { AddressSectionSkeleton } from "@/checkout-storefront/sections/ShippingAddressSection/AddressSectionSkeleton";
import { useCheckoutForm } from "@/checkout-storefront/sections/CheckoutForm/useCheckoutForm";
import { AdyenDropIn } from "../PaymentSection/AdyenDropIn/AdyenDropIn";
import { commonMessages } from "@/checkout-storefront/lib/commonMessages";
import { checkoutFormLabels, checkoutFormMessages } from "./messages";

export const CheckoutForm = () => {
  const formatMessage = useFormattedMessages();
  const { checkout, loading } = useCheckout();
  const { authenticating } = useAuthState();
  const { checkoutFinalize, errors: userRegisterErrors } = useCheckoutFinalize();

  const isLoading = loading || authenticating;
  const [showOnlyContact, setShowOnlyContact] = useState(false);

  const { handleSubmit, isProcessingApiChanges, methods } = useCheckoutForm({
    userRegisterErrors,
    checkoutFinalize,
  });

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
            <AdyenDropIn />
            <Controller
              name="paymentMethodId"
              control={methods.control}
              render={({ field: { onChange } }) => (
                <PaymentSection
                  collapsed={showOnlyContact}
                  onSelect={onChange}
                  selectedPaymentMethod={methods.watch("paymentMethodId")}
                  setValue={methods.setValue}
                />
              )}
            />
          </>
        </FormProvider>
      </div>
      {!showOnlyContact &&
        (isProcessingApiChanges ? (
          <Button
            className="pay-button"
            disabled
            ariaLabel={formatMessage(checkoutFormLabels.pay)}
            label={formatMessage(commonMessages.processing)}
          />
        ) : (
          <Button
            disabled={isLoading}
            ariaLabel={formatMessage(checkoutFormLabels.pay)}
            label={formatMessage(checkoutFormMessages.pay)}
            className="pay-button"
            onClick={handleSubmit}
          />
        ))}
    </div>
  );
};
