import { useCheckoutEmailUpdateMutation } from "@/checkout-storefront/graphql";
import { useAlerts, useCheckout, useErrorMessages } from "@/checkout-storefront/hooks";
import {
  useCheckoutUpdateStateActions,
  useUserRegisterState,
} from "@/checkout-storefront/state/updateStateStore";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import {
  extractMutationErrors,
  localeToLanguageCode,
  useValidationResolver,
} from "@/checkout-storefront/lib/utils";
import { useAuth, useAuthState } from "@saleor/sdk";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

export interface GuestUserFormData {
  email: string;
  password: string;
}

export const useGuestUserForm = ({ createAccount }: { createAccount: boolean }) => {
  const { checkout } = useCheckout();
  const { register } = useAuth();
  const { user } = useAuthState();
  const { showErrors } = useAlerts("userRegister");
  const shouldUserRegister = useUserRegisterState();
  const { errorMessages } = useErrorMessages();
  const { setCheckoutUpdateState } = useCheckoutUpdateStateActions("checkoutEmailUpdate");
  const [, updateEmail] = useCheckoutEmailUpdateMutation();
  const { locale } = useLocale();

  const schema = object({
    email: string().email(errorMessages.invalid).required(errorMessages.required),
    password: string(),
  });

  const resolver = useValidationResolver(schema);

  const defaultValues = { email: checkout.email || "", password: "", createAccount: false };

  const formProps = useForm<GuestUserFormData>({
    resolver,
    mode: "onChange",
    defaultValues,
  });

  const { getValues } = formProps;

  useCheckoutFormValidationTrigger({
    scope: "guestUser",
    formProps,
  });

  const handleUserRegister = useCallback(async () => {
    const formData = getValues();
    const { email, password } = formData;

    if (user || !createAccount) {
      return true;
    }

    const registerFormData = { email, password };

    // adding redirect url because some saleor envs require it
    const result = await register({
      ...registerFormData,
      redirectUrl: location.href,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      showErrors(errors);
      return !hasErrors;
    }

    return true;
  }, [createAccount, getValues, register, showErrors, user]);

  useEffect(() => {
    if (shouldUserRegister) {
      void handleUserRegister();
    }
  }, [handleUserRegister, shouldUserRegister]);

  const handleCheckoutEmailUpdate = useCallback(
    async ({ email }: GuestUserFormData) => {
      // const isValid = await trigger();

      if (!email) {
        return;
      }

      setCheckoutUpdateState("loading");

      const result = await updateEmail({
        languageCode: localeToLanguageCode(locale),
        email,
        checkoutId: checkout.id,
      });

      const [hasErrors, errors] = extractMutationErrors<FormData>(result);

      if (hasErrors) {
        setCheckoutUpdateState("error");
        showErrors(errors);
        return;
      }

      setCheckoutUpdateState("success");
    },
    [updateEmail, locale, checkout.id, showErrors]
  );

  return {
    formProps,
    onCheckoutEmailUpdate: handleCheckoutEmailUpdate,
    defaultFormData: defaultValues,
  };
};
