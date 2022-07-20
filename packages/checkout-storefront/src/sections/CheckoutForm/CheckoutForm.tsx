import { Divider } from "@/checkout-storefront/components/Divider";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import {
  Contact,
  ContactSkeleton,
} from "@/checkout-storefront/sections/Contact";
import {
  ShippingMethods,
  ShippingMethodsSkeleton,
} from "@/checkout-storefront/sections/ShippingMethods";
import {
  Addresses,
  AddressesSkeleton,
} from "@/checkout-storefront/sections/Addresses";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { useValidationResolver } from "@/checkout-storefront/lib/utils";
import { Suspense } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { object, string } from "yup";
import { Button } from "@/checkout-storefront/components/Button";
import { useCheckoutFinalize } from "./useCheckoutFinalize";
import { FormData } from "./types";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useAuthState } from "@saleor/sdk";
import "./CheckoutFormStyles.css";
import { useSetFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors";
import { usePaymentMethods } from "../PaymentMethods/usePaymentMethods";
import { PaymentMethods } from "../PaymentMethods";
import { PaymentProviderID } from "checkout-common";

export const CheckoutForm = () => {
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();
  const { checkout, loading } = useCheckout();
  const { authenticating } = useAuthState();
  const {
    checkoutFinalize,
    submitting,
    errors: userRegisterErrors,
  } = useCheckoutFinalize();

  const isLoading = loading || authenticating;
  const usePaymentProvidersProps = usePaymentMethods(checkout?.channel?.id);
  const { selectedPaymentProvider } = usePaymentProvidersProps;

  const schema = object({
    password: string().required(errorMessages.required),
    email: string()
      .email(errorMessages.invalid)
      .required(errorMessages.required),
  });

  const resolver = useValidationResolver(schema);
  // will be used for e.g. account creation at checkout finalization
  const methods = useForm<FormData>({
    resolver,
    mode: "onBlur",
    defaultValues: { email: checkout?.email || "", createAccount: false },
  });

  useSetFormErrors<FormData>({
    setError: methods.setError,
    errors: userRegisterErrors,
  });

  const { getValues } = methods;

  // not using form handleSubmit on purpose
  const handleSubmit = () =>
    void checkoutFinalize({
      ...getValues(),
      paymentProviderId: selectedPaymentProvider as PaymentProviderID,
    });

  const payButtonDisabled =
    submitting ||
    (checkout?.isShippingRequired && !checkout?.shippingAddress) ||
    !checkout?.billingAddress ||
    !selectedPaymentProvider;

  return (
    <div className="checkout-form">
      <FormProvider {...methods}>
        {isLoading ? <ContactSkeleton /> : <Contact />}
      </FormProvider>
      <Divider className="mt-4" />
      <Suspense fallback={<AddressesSkeleton />}>
        {isLoading ? <AddressesSkeleton /> : <Addresses />}
      </Suspense>
      <Suspense fallback={<ShippingMethodsSkeleton />}>
        {isLoading ? <ShippingMethodsSkeleton /> : <ShippingMethods />}
      </Suspense>
      <PaymentMethods {...usePaymentProvidersProps} />
      {isLoading ? (
        <Button
          ariaLabel={formatMessage("finalizeCheckoutLabel")}
          label=""
          className="pay-button"
        />
      ) : (
        <Button
          disabled={payButtonDisabled}
          ariaLabel={formatMessage("finalizeCheckoutLabel")}
          label="Pay"
          onClick={handleSubmit}
          className="pay-button"
        />
      )}
    </div>
  );
};
