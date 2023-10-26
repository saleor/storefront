import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { Contact } from "@/checkout-storefront/sections/Contact";
import { DeliveryMethods } from "@/checkout-storefront/sections/DeliveryMethods";
import { Suspense, useEffect, useState } from "react";
import { ContactSkeleton } from "@/checkout-storefront/sections/Contact/ContactSkeleton";
import { DeliveryMethodsSkeleton } from "@/checkout-storefront/sections/DeliveryMethods/DeliveryMethodsSkeleton";
import { AddressSectionSkeleton } from "@/checkout-storefront/components/AddressSectionSkeleton";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";
import { CollapseSection } from "@/checkout-storefront/sections/CheckoutForm/CollapseSection";
import { Divider } from "@/checkout-storefront/components";
import { UserShippingAddressSection } from "@/checkout-storefront/sections/UserShippingAddressSection";
import { GuestShippingAddressSection } from "@/checkout-storefront/sections/GuestShippingAddressSection";
import { UserBillingAddressSection } from "@/checkout-storefront/sections/UserBillingAddressSection";
import {
  PaymentSection,
  PaymentSectionSkeleton,
} from "@/checkout-storefront/sections/PaymentSection";
import { GuestBillingAddressSection } from "@/checkout-storefront/sections/GuestBillingAddressSection";
import { useUser } from "@/checkout-storefront/hooks/useUser";
import { InvoiceRequestSection } from "../InvoiceRequestSection/InvoiceRequestSection";

export const CheckoutForm = () => {
  const { user } = useUser();
  const { checkout } = useCheckout();
  const { passwordResetToken } = getQueryParams();
  const [selectedCourier, setSelectedCourier] = useState("");

  const [showOnlyContact, setShowOnlyContact] = useState(!!passwordResetToken);
  const [, setPaymentSectionVisible] = useState(true);

  const handleCourierSelection = (courierName: string) => {
    setSelectedCourier(courierName);

    if (courierName === "Kurier pobranie, GLS") {
      setPaymentSectionVisible(false);
    } else {
      setPaymentSectionVisible(true);
    }
  };

  return (
    <div className="checkout-form-container">
      <div className="checkout-form">
        <Suspense fallback={<ContactSkeleton />}>
          <Contact setShowOnlyContact={setShowOnlyContact} />
        </Suspense>
        <>
          {checkout?.isShippingRequired && (
            <Suspense fallback={<AddressSectionSkeleton />}>
              <Divider />
              <CollapseSection collapse={showOnlyContact}>
                <div className="section" data-testid="shippingAddressSection">
                  {user ? <UserShippingAddressSection /> : <GuestShippingAddressSection />}
                </div>
              </CollapseSection>
            </Suspense>
          )}
          <InvoiceRequestSection collapsed={showOnlyContact} />
          <Suspense fallback={<DeliveryMethodsSkeleton />}>
            <DeliveryMethods
              collapsed={showOnlyContact}
              selectedCourier={selectedCourier}
              onCourierSelection={handleCourierSelection}
            />
          </Suspense>
          <Suspense fallback={<PaymentSectionSkeleton />}>
            <CollapseSection collapse={showOnlyContact}>
              <PaymentSection selectedCourier={selectedCourier}>
                {user ? <UserBillingAddressSection /> : <GuestBillingAddressSection />}
              </PaymentSection>
            </CollapseSection>
          </Suspense>
        </>
      </div>
    </div>
  );
};
