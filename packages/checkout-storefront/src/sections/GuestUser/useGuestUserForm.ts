import { useUserRegisterMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import {
  useCheckoutUpdateStateActions,
  useCheckoutUpdateStateChange,
  useUserRegisterState,
} from "@/checkout-storefront/state/updateStateStore";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { useAuthState } from "@saleor/sdk";
import { useEffect, useState } from "react";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { ChangeHandler, useForm } from "@/checkout-storefront/hooks/useForm";
import { getCurrentHref } from "@/checkout-storefront/lib/utils/locale";
import { useCheckoutEmailUpdate } from "@/checkout-storefront/sections/GuestUser/useCheckoutEmailUpdate";
import { object, string } from "yup";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { passwordMessages } from "@/checkout-storefront/sections/SignIn/messages";

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
  const { errorMessages } = useErrorMessages();
  const formatMessage = useFormattedMessages();
  const { setCheckoutUpdateState: setRegisterState } = useCheckoutUpdateStateChange("userRegister");
  const [, userRegister] = useUserRegisterMutation();
  const [userRegisterDisabled, setUserRegistrationDisabled] = useState(false);
  const { setCheckoutUpdateState } = useCheckoutUpdateStateChange("checkoutEmailUpdate");

  const validationSchema = object({
    email: string().email(errorMessages.invalid).required(errorMessages.required),
    password: string().min(8, formatMessage(passwordMessages.passwordAtLeastCharacters)),
  });

  const defaultFormData: GuestUserFormData = {
    email: checkout.email || "",
    password: "",
    createAccount: false,
  };

  const onSubmit = useFormSubmit<GuestUserFormData, typeof userRegister>({
    scope: "userRegister",
    onSubmit: userRegister,
    onEnter: () => setShouldRegisterUser(false),
    shouldAbort: async ({ formData, formHelpers: { validateForm } }) => {
      const errors = validateForm(formData);
      return !!Object.values(errors);
    },
    parse: ({ email, password, channel }) => ({
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

  const form = useForm<GuestUserFormData>({
    initialValues: defaultFormData,
    onSubmit,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    initialTouched: { email: true },
  });

  const {
    values: { email, createAccount },
    handleSubmit,
    handleChange,
    validateField,
  } = form;

  useCheckoutFormValidationTrigger({
    scope: "guestUser",
    form,
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

  useCheckoutEmailUpdate({ email });

  // since we use debounced submit, set update
  // state as "loading" right away
  const onChange: ChangeHandler = async (event) => {
    handleChange(event);

    const error = await validateField("email");

    if (!error) {
      setCheckoutUpdateState("loading");
    }
  };

  return { ...form, handleChange: onChange };
};