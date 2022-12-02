import {
  useCheckoutEmailUpdateMutation,
  useUserRegisterMutation,
} from "@/checkout-storefront/graphql";
import { useAlerts, useCheckout, useErrorMessages } from "@/checkout-storefront/hooks";
import {
  useCheckoutUpdateStateActions,
  useCheckoutUpdateStateChange,
  useUserRegisterState,
} from "@/checkout-storefront/state/updateStateStore";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import {
  extractMutationErrors,
  localeToLanguageCode,
  useValidationResolver,
} from "@/checkout-storefront/lib/utils";
import { useAuthState } from "@saleor/sdk";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

export interface GuestUserFormData {
  email: string;
  password: string;
}

export const useGuestUserForm = ({ createAccount }: { createAccount: boolean }) => {
  const { checkout } = useCheckout();
  const { user } = useAuthState();
  const { showErrors } = useAlerts("userRegister");
  const shouldUserRegister = useUserRegisterState();
  const { setShouldRegisterUser } = useCheckoutUpdateStateActions();
  const { errorMessages } = useErrorMessages();
  const { setCheckoutUpdateState: setEmailUpdateState } =
    useCheckoutUpdateStateChange("checkoutEmailUpdate");
  const { setCheckoutUpdateState: setRegisterState } = useCheckoutUpdateStateChange("userRegister");
  const [, updateEmail] = useCheckoutEmailUpdateMutation();
  const { locale } = useLocale();
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

  const handleUserRegister = useCallback(async () => {
    const formData = getValues();
    const { email, password } = formData;

    setShouldRegisterUser(false);

    const isValid = await trigger();

    if (!isValid) {
      return;
    }

    setRegisterState("loading");

    const registerFormData = { email, password };

    // adding redirect url because some saleor envs require it
    const result = await userRegister({
      input: { ...registerFormData, redirectUrl: location.href, channel: checkout.channel.slug },
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      setRegisterState("error");
      showErrors(errors);

      const hasAccountForCurrentEmail = errors.some(({ code }) => code === "UNIQUE");

      if (hasAccountForCurrentEmail) {
        setUserRegistrationDisabled(true);
        // this logic will be removed once new register flow is implemented
        setTimeout(() => setRegisterState("success"), 100);
      }

      return;
    }

    setUserRegistrationDisabled(true);
    setRegisterState("success");
  }, [
    checkout.channel.slug,
    getValues,
    setRegisterState,
    setShouldRegisterUser,
    showErrors,
    trigger,
    userRegister,
  ]);

  useEffect(() => {
    if (!shouldUserRegister || user || !createAccount || userRegisterDisabled) {
      return;
    }

    void handleUserRegister();
  }, [createAccount, handleUserRegister, shouldUserRegister, user, userRegisterDisabled]);

  const handleCheckoutEmailUpdate = useCallback(
    async ({ email }: GuestUserFormData) => {
      if (!email) {
        return;
      }

      setEmailUpdateState("loading");

      const result = await updateEmail({
        languageCode: localeToLanguageCode(locale),
        email,
        checkoutId: checkout.id,
      });

      const [hasErrors, errors] = extractMutationErrors<FormData>(result);

      if (hasErrors) {
        setEmailUpdateState("error");
        showErrors(errors);
        return;
      }

      setEmailUpdateState("success");
    },
    [setEmailUpdateState, updateEmail, locale, checkout.id, showErrors]
  );

  return {
    formProps,
    onCheckoutEmailUpdate: handleCheckoutEmailUpdate,
    defaultFormData: defaultValues,
  };
};
