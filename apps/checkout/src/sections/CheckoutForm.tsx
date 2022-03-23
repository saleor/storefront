import { Divider } from "@components/Divider";
import { useErrorMessages } from "@hooks/useErrorMessages";
import { useValidationResolver } from "@lib/utils";
import { Suspense } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { object, string } from "yup";
import { Contact } from "./Contact";

interface FormData {
  email: string;
  password: string;
}

export const CheckoutForm = () => {
  const errorMessages = useErrorMessages();
  const schema = object({
    password: string().required(errorMessages.requiredField),
    email: string()
      .email(errorMessages.invalidValue)
      .required(errorMessages.requiredField),
  });
  const resolver = useValidationResolver(schema);
  // will be used for e.g. account creation at checkout finalization
  const methods = useForm<FormData>({ resolver, mode: "onBlur" });
  const { setValue, watch } = methods;

  const handleEmailChange = (value: string) => setValue("email", value);

  return (
    <Suspense fallback="loaden">
      <FormProvider {...methods}>
        <div className="checkout-form">
          <Contact onEmailChange={handleEmailChange} email={watch("email")} />
          <Divider className="mt-4" />
        </div>
      </FormProvider>
    </Suspense>
  );
};
