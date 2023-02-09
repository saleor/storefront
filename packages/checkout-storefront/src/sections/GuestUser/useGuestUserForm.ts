import { useUserRegisterMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import {
  useCheckoutUpdateStateActions,
  useCheckoutUpdateStateChange,
  useUserRegisterState,
} from "@/checkout-storefront/state/updateStateStore";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { useEffect, useState, useMemo } from "react";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { ChangeHandler, hasErrors, useForm } from "@/checkout-storefront/hooks/useForm";
import { getCurrentHref } from "@/checkout-storefront/lib/utils/locale";
import { useCheckoutEmailUpdate } from "@/checkout-storefront/sections/GuestUser/useCheckoutEmailUpdate";
import { object, string } from "yup";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { passwordMessages } from "@/checkout-storefront/sections/SignIn/messages";
import { useUser } from "@/checkout-storefront/hooks/useUser";

export interface GuestUserFormData {
  email: string;
  password: string;
  createAccount: boolean;
}

interface GuestUserFormProps {
  // shared between sign in form and guest user form
  initialEmail: string;
}

export const useGuestUserForm = ({ initialEmail }: GuestUserFormProps) => {
  const { checkout } = useCheckout();
  const { user } = useUser();
  const shouldUserRegister = useUserRegisterState();
  const { setShouldRegisterUser, setSubmitInProgress } = useCheckoutUpdateStateActions();
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
    email: initialEmail || checkout.email || "",
    password: "",
    createAccount: false,
  };

  const onSubmit = useFormSubmit<GuestUserFormData, typeof userRegister>(
    useMemo(
      () => ({
        scope: "userRegister",
        onSubmit: userRegister,
        onStart: () => setShouldRegisterUser(false),
        shouldAbort: async ({ formData, formHelpers: { validateForm } }) => {
          const errors = await validateForm(formData);
          return hasErrors(errors);
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
          setSubmitInProgress(false);
          const hasAccountForCurrentEmail = errors.some(({ code }) => code === "UNIQUE");

          if (hasAccountForCurrentEmail) {
            setUserRegistrationDisabled(true);
            // @todo this logic will be removed once new register flow is implemented
            setTimeout(() => setRegisterState("success"), 100);
          }
        },
        onSuccess: () => setUserRegistrationDisabled(true),
      }),
      [setRegisterState, setShouldRegisterUser, setSubmitInProgress, userRegister]
    )
  );

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
