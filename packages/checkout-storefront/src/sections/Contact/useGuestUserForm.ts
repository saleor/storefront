import {
  useCheckoutEmailUpdateMutation,
  useUserRegisterMutation,
} from "@/checkout-storefront/graphql";
import { useCheckout, useErrorMessages } from "@/checkout-storefront/hooks";
import {
  useCheckoutUpdateStateActions,
  useCheckoutUpdateStateChange,
  useUserRegisterState,
} from "@/checkout-storefront/state/updateStateStore";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { getCurrentHref, useValidationResolver } from "@/checkout-storefront/lib/utils";
import { useAuthState } from "@saleor/sdk";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";

export interface GuestUserFormData {
  email: string;
  password: string;
}

export const useGuestUserForm = ({ createAccount }: { createAccount: boolean }) => {
  const { checkout } = useCheckout();
  const { user } = useAuthState();
  const shouldUserRegister = useUserRegisterState();
  const { setShouldRegisterUser } = useCheckoutUpdateStateActions();
  const { errorMessages } = useErrorMessages();
  const { setCheckoutUpdateState: setRegisterState } = useCheckoutUpdateStateChange("userRegister");
  const [, updateEmail] = useCheckoutEmailUpdateMutation();
  const [, userRegister] = useUserRegisterMutation();
  const [userRegisterDisabled, setUserRegistrationDisabled] = useState(false);

  const schema = object({
    email: string().email(errorMessages.invalid).required(errorMessages.required),
    password: string(),
    // add when we add formik and can validate only part of the form
    // .min(8, formatMessage(passwordErrorMessages.passwordAtLeastCharacters)),
  });

  const resolver = useValidationResolver(schema);

  const defaultValues = { email: checkout.email || "", password: "", createAccount: false };

  const formProps = useForm<GuestUserFormData>({
    resolver,
    mode: "onChange",
    defaultValues,
  });

  const { getValues, watch, trigger } = formProps;

  useCheckoutFormValidationTrigger({
    scope: "guestUser",
    formProps,
  });

  const email = watch("email");

  useEffect(() => {
    setUserRegistrationDisabled(false);
  }, [email]);

  const handleUserRegister = useSubmit<GuestUserFormData, typeof userRegister>({
    scope: "userRegister",
    onSubmit: userRegister,
    onEnter: () => setShouldRegisterUser(false),
    shouldAbort: async () => {
      const isValid = await trigger();
      return !isValid;
    },
    formDataParse: ({ email, password, channel }) => ({
      input: {
        email,
        password,
        channel,
        redirectUrl: getCurrentHref(),
      },
    }),
    onError: (errors) => {
      const hasAccountForCurrentEmail = errors.some(({ code }) => code === "UNIQUE");

      if (hasAccountForCurrentEmail) {
        setUserRegistrationDisabled(true);
        // this logic will be removed once new register flow is implemented
        setTimeout(() => setRegisterState("success"), 100);
      }
    },
    onSuccess: () => setUserRegistrationDisabled(true),
  });

  useEffect(() => {
    if (!shouldUserRegister || user || !createAccount || userRegisterDisabled) {
      return;
    }

    void handleUserRegister(getValues());
  }, [
    createAccount,
    getValues,
    handleUserRegister,
    shouldUserRegister,
    user,
    userRegisterDisabled,
  ]);

  const handleCheckoutEmailUpdate = useSubmit<GuestUserFormData, typeof updateEmail>({
    scope: "checkoutEmailUpdate",
    onSubmit: updateEmail,
    formDataParse: ({ languageCode, checkoutId, email }) => ({ languageCode, checkoutId, email }),
  });

  return {
    formProps,
    onCheckoutEmailUpdate: handleCheckoutEmailUpdate,
    defaultFormData: defaultValues,
  };
};
