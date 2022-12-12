import { useUserRegisterMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks";
import {
  useCheckoutUpdateStateActions,
  useCheckoutUpdateStateChange,
  useUserRegisterState,
} from "@/checkout-storefront/state/updateStateStore";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { getCurrentHref } from "@/checkout-storefront/lib/utils";
import { useAuthState } from "@saleor/sdk";
import { useEffect, useState } from "react";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { useForm } from "@/checkout-storefront/hooks/useForm";

export interface GuestUserFormData {
  email: string;
  password: string;
  createAccount: boolean;
}

export const useGuestUserForm = () => {
  const { checkout } = useCheckout();
  const { user } = useAuthState();
  const shouldUserRegister = useUserRegisterState();
  const { setShouldRegisterUser } = useCheckoutUpdateStateActions();
  // const { errorMessages } = useErrorMessages();
  const { setCheckoutUpdateState: setRegisterState } = useCheckoutUpdateStateChange("userRegister");
  const [, userRegister] = useUserRegisterMutation();
  const [userRegisterDisabled, setUserRegistrationDisabled] = useState(false);

  // const schema = object({
  //   email: string().email(errorMessages.invalid).required(errorMessages.required),
  //   password: string(),
  //   // add when we add formik and can validate only part of the form
  //   // .min(8, formatMessage(passwordErrorMessages.passwordAtLeastCharacters)),
  // });

  // const resolver = useValidationResolver(schema);

  const defaultFormData: GuestUserFormData = {
    email: checkout.email || "",
    password: "",
    createAccount: false,
  };

  const { onSubmit } = useSubmit<GuestUserFormData, typeof userRegister>({
    scope: "userRegister",
    onSubmit: userRegister,
    onEnter: () => setShouldRegisterUser(false),
    shouldAbort: async ({ formData, validateForm }) => {
      const errors = validateForm(formData);
      return !!Object.values(errors);
    },
    formDataParse: ({ email, password, channel }) => ({
      input: {
        email,
        password,
        channel,
        redirectUrl: getCurrentHref(),
      },
    }),
    onError: ({ errors }) => {
      const hasAccountForCurrentEmail = errors.some(({ code }) => code === "UNIQUE");

      if (hasAccountForCurrentEmail) {
        setUserRegistrationDisabled(true);
        // this logic will be removed once new register flow is implemented
        setTimeout(() => setRegisterState("success"), 100);
      }
    },
    onSuccess: () => setUserRegistrationDisabled(true),
  });

  const form = useForm({
    initialValues: defaultFormData,
    onSubmit,
  });

  const {
    values: { email, createAccount },
    handleSubmit,
  } = form;

  useCheckoutFormValidationTrigger({
    scope: "guestUser",
    formProps: form,
  });

  useEffect(() => {
    setUserRegistrationDisabled(false);
  }, [email]);

  useEffect(() => {
    if (!shouldUserRegister || user || !createAccount || userRegisterDisabled) {
      return;
    }

    void handleSubmit();
  }, [createAccount, handleSubmit, shouldUserRegister, user, userRegisterDisabled]);

  return form;
};
