import { Button } from "@/checkout-storefront/components/Button";
import { PasswordInput } from "@/checkout-storefront/components/PasswordInput";
import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useAuth, useAuthState } from "@saleor/sdk";
import React from "react";
import { SignInFormContainer, SignInFormContainerProps } from "./SignInFormContainer";
import { getCurrentHref, useValidationResolver } from "@/checkout-storefront/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import { object, string } from "yup";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { useEffect } from "react";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { contactLabels, contactMessages } from "./messages";
import { commonMessages } from "@/checkout-storefront/lib/commonMessages";
import { ApiError, useGetParsedApiErrors } from "@/checkout-storefront/hooks";
import { setFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors/utils";
import { AccountErrorCode, useRequestPasswordResetMutation } from "@/checkout-storefront/graphql";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";

interface SignInFormProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
  onSignInSuccess: () => void;
}

interface SignInFormData {
  email: string;
  password: string;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSectionChange, onSignInSuccess }) => {
  const formatMessage = useFormattedMessages();
  const { showErrors } = useAlerts();
  const { errorMessages } = useErrorMessages();
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const { login } = useAuth();
  const { authenticating } = useAuthState();
  const { getFormErrorsFromApiErrors } = useGetParsedApiErrors<SignInFormData>();
  const [, requestPasswordReset] = useRequestPasswordResetMutation();

  const schema = object({
    password: string().required(errorMessages.required),
    email: string().email(errorMessages.invalid).required(errorMessages.required),
  });

  const resolver = useValidationResolver(schema);

  const formProps = useForm<SignInFormData>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      email: "", // once we move to formik it should share email between
      // sign in, register and guest user form
      password: "",
    },
  });

  const { handleSubmit, getValues, watch, setError, clearErrors } = formProps;

  const getInputProps = useGetInputProps(formProps);

  // @ts-ignore because login comes from the sdk which is no longer
  // maintained so we'll eventually have to implement our own auth flow
  const handleSignIn = useSubmit<SignInFormData, typeof login>({
    onSubmit: login,
    onSuccess: onSignInSuccess,
    formDataParse: (data) => data,
    onError: (errors) => {
      //  api will attribute invalid credentials error to
      // email but we'd rather highlight both fields
      const fieldsErrors = errors.some(
        ({ code }) => (code as AccountErrorCode) === "INVALID_CREDENTIALS"
      )
        ? [...errors, { code: "", message: "", field: "password" } as ApiError<SignInFormData>]
        : errors;

      setFormErrors({ errors: getFormErrorsFromApiErrors(fieldsErrors), setError });
      showErrors(errors, "login");
    },
  });

  const handlePasswordReset = useSubmit<SignInFormData, typeof requestPasswordReset>({
    onEnter: () => clearErrors("password"),
    scope: "requestPasswordReset",
    onSubmit: requestPasswordReset,
    onSuccess: () => setPasswordResetSent(true),
    formDataParse: ({ email, channel }) => ({ email, redirectUrl: getCurrentHref(), channel }),
  });

  const emailValue = watch("email");

  useEffect(() => {
    setPasswordResetSent(false);
  }, [emailValue]);

  return (
    <SignInFormContainer
      title={formatMessage(contactMessages.signIn)}
      redirectSubtitle={formatMessage(contactMessages.newCustomer)}
      redirectButtonLabel={formatMessage(contactMessages.guestCheckout)}
      onSectionChange={onSectionChange}
    >
      <form>
        <TextInput label={formatMessage(contactMessages.email)} {...getInputProps("email")} />
        <PasswordInput
          label={formatMessage(contactMessages.password)}
          {...getInputProps("password")}
        />
        <div className="actions">
          {passwordResetSent && (
            <Text>{formatMessage(contactMessages.linkSent, { email: getValues().email })}</Text>
          )}
          <Button
            disabled={authenticating}
            ariaLabel={formatMessage(contactLabels.sendResetLink)}
            variant="tertiary"
            label={formatMessage(
              passwordResetSent ? contactMessages.resend : contactMessages.forgotPassword
            )}
            className="ml-1 mr-4"
            onClick={() => {
              void handlePasswordReset(getValues());
            }}
          />
          <Button
            disabled={authenticating}
            ariaLabel={formatMessage(contactLabels.signIn)}
            onClick={handleSubmit(handleSignIn)}
            label={formatMessage(
              authenticating ? commonMessages.processing : contactMessages.signIn
            )}
          />
        </div>
      </form>
    </SignInFormContainer>
  );
};
