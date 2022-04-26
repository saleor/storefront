import { Divider } from "@/components/Divider";
import { useCheckout } from "@/hooks/useCheckout";
import { Contact } from "@/sections/Contact";
import { ShippingMethods } from "@/sections/ShippingMethods";
import { UserAddresses } from "@/sections/UserAddresses";
import { useErrorMessages } from "@/hooks/useErrorMessages";
import { useValidationResolver } from "@/lib/utils";
import { Suspense } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { object, string } from "yup";
import { Button } from "@/components/Button";
import { useCheckoutFinalize } from "./useCheckoutFinalize";
import { FormData } from "./types";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";

export const CheckoutForm = () => {
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();
  const { checkout } = useCheckout();
  const { checkoutFinalize } = useCheckoutFinalize();

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

  return (
    <Suspense fallback="loaden">
      <div className="checkout-form">
        <FormProvider {...methods}>
          <Contact />
        </FormProvider>
        <Divider className="mt-4" />
        <UserAddresses />
        <ShippingMethods />
        {/* TMP */}
        {/* <PaymentProviders
            onSelect={setSelectedPaymentProvider}
            selectedValue={selectedPaymentProvider}
          /> */}
        <Button
          ariaLabel={formatMessage("finalizeCheckoutLabel")}
          title="Pay"
          onClick={handleSubmit}
          className="min-w-28"
        />
      </div>
    </Suspense>
  );
};
