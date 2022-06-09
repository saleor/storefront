import { Divider } from "@/checkout/components/Divider";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { Contact, ContactSkeleton } from "@/checkout/sections/Contact";
import {
  ShippingMethods,
  ShippingMethodsSkeleton,
} from "@/checkout/sections/ShippingMethods";
import { Addresses, AddressesSkeleton } from "@/checkout/sections/Addresses";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { useValidationResolver } from "@/checkout/lib/utils";
import { Suspense } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { object, string } from "yup";
import { Button } from "@/checkout/components/Button";
import { useCheckoutFinalize } from "./useCheckoutFinalize";
import { FormData } from "./types";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { useAuthState } from "@saleor/sdk";
import "./CheckoutFormStyles.css";

export const CheckoutForm = () => {
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();
  const { checkout, loading } = useCheckout();
  const { authenticating } = useAuthState();
  const { checkoutFinalize, submitting } = useCheckoutFinalize();

  const isLoading = loading || authenticating;

  // TMP
  // const [selectedPaymentProvider, setSelectedPaymentProvider] =
  //   useState<string>();

  const schema = object({
    password: string().required(errorMessages.requiredValue),
    email: string()
      .email(errorMessages.invalidValue)
      .required(errorMessages.requiredValue),
  });

  const resolver = useValidationResolver(schema);
  // will be used for e.g. account creation at checkout finalization
  const methods = useForm<FormData>({
    resolver,
    mode: "onBlur",
    defaultValues: { email: checkout?.email || "", createAccount: false },
  });

  const { getValues } = methods;

  // not using form handleSubmit on purpose
  const handleSubmit = () => checkoutFinalize(getValues());

  const payButtonDisabled =
    submitting ||
    (checkout?.isShippingRequired && !checkout?.shippingAddress) ||
    !checkout?.billingAddress;

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
      {/* TMP */}
      {/* <PaymentProviders
            onSelect={setSelectedPaymentProvider}
            selectedValue={selectedPaymentProvider}
          /> */}
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
