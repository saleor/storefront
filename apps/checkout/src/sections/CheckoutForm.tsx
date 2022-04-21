import { Divider } from "@/components/Divider";
import { useCheckout } from "@/hooks/useCheckout";
import { useErrorMessages } from "@/hooks/useErrorMessages";
import { useValidationResolver } from "@/lib/utils";
import { PaymentProviders } from "./PaymentProviders";
import { ShippingMethods } from "./ShippingMethods";
import { UserAddresses } from "./UserAddresses";
import { Suspense, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { object, string } from "yup";
import { Contact } from "./Contact";
import { pay as payRequest } from "@/fetch";
import { Button } from "@/components/Button";
import { useFetch } from "@/hooks/useFetch";

interface FormData {
  email: string;
  password: string;
}

export const CheckoutForm = () => {
  const { errorMessages } = useErrorMessages();
  const { checkout } = useCheckout();
  const [{ data }, pay] = useFetch(payRequest, { opts: { skip: true } });

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
    defaultValues: { email: checkout?.email || "" },
  });

  const { setValue, watch } = methods;

  const handleEmailChange = (value: string) => setValue("email", value);

  const finalizeCheckout = async () => {
    const data = await pay({
      provider: "mollie",
      checkoutId: checkout?.id,
      totalAmount: checkout?.totalPrice?.gross?.amount as number,
    });

    if (data!.checkoutUrl) {
      window.location.replace(data!.checkoutUrl);
    }
  };

  return (
    <Suspense fallback="loaden">
      <FormProvider {...methods}>
        <div className="checkout-form">
          <Contact onEmailChange={handleEmailChange} email={watch("email")} />
          <Divider className="mt-4" />
          <UserAddresses />
          <ShippingMethods />
          {/* TMP */}
          {/* <PaymentProviders
            onSelect={setSelectedPaymentProvider}
            selectedValue={selectedPaymentProvider}
          /> */}
          <Button
            ariaLabel="finaliza checkout"
            title="Pay"
            onClick={finalizeCheckout}
            className="min-w-28"
          />
        </div>
      </FormProvider>
    </Suspense>
  );
};
