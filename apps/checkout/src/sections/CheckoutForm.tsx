import { Divider } from "@components/Divider";
import { useCheckout } from "@hooks/useCheckout";
import { useErrorMessages } from "@hooks/useErrorMessages";
import { useValidationResolver } from "@lib/utils";
import React, { Suspense } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { object, string } from "yup";
import { Contact } from "./Contact";
import { PaymentOptions } from "./PaymentOptions";
import { ShippingMethods } from "./ShippingMethods";
import { UserAddresses } from "./UserAddresses";

interface FormData {
  email: string;
  password: string;
}

export const CheckoutForm = () => {
  const { checkout } = useCheckout();

  const errorMessages = useErrorMessages();
  const schema = object({
    password: string().required(errorMessages.requiredField),
    email: string()
      .email(errorMessages.invalidValue)
      .required(errorMessages.requiredField),
  });
  const resolver = useValidationResolver(schema);
  // will be used for e.g. account creation at checkout finalization
  const methods = useForm<FormData>({
    resolver,
    mode: "onBlur",
    defaultValues: { email: checkout?.email || "" },
  });
  const { setValue, watch } = methods;

  const handleEmailChange = (value: string) => setValue("email", value);

  return (
    <Suspense fallback="loaden">
      <FormProvider {...methods}>
        <div className="checkout-form">
          <Contact onEmailChange={handleEmailChange} email={watch("email")} />
          <Divider className="mt-4" />
          <UserAddresses />
          <ShippingMethods />
          <PaymentOptions />
        </div>
      </FormProvider>
    </Suspense>
  );
};
