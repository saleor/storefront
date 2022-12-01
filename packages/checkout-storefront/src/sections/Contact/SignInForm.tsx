import { Button } from "@/checkout-storefront/components/Button";
import { PasswordInput } from "@/checkout-storefront/components/PasswordInput";
import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useAuth, useAuthState } from "@saleor/sdk";
import React from "react";
import { SignInFormContainer, SignInFormContainerProps } from "./SignInFormContainer";
import {
  extractMutationErrors,
  extractValidationError,
  getCurrentHref,
  useValidationResolver,
} from "@/checkout-storefront/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import { object, string, ValidationError } from "yup";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { useEffect } from "react";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { contactLabels, contactMessages } from "./messages";
import { commonMessages } from "@/checkout-storefront/lib/commonMessages";
import { ApiError, useCheckout, useGetParsedApiErrors } from "@/checkout-storefront/hooks";
import { setFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors/utils";
import { AccountErrorCode } from "@/checkout-storefront/graphql";

interface SignInFormProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
  onSignInSuccess: () => void;
}

interface FormData {
  email: string;
  password: string;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSectionChange, onSignInSuccess }) => {
  const formatMessage = useFormattedMessages();
  const { checkout } = useCheckout();
  const { showErrors } = useAlerts();
  const { errorMessages } = useErrorMessages();
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const { login, requestPasswordReset } = useAuth();
  const { authenticating } = useAuthState();
  const { getFormErrorsFromApiErrors } = useGetParsedApiErrors<FormData>();

  const schema = object({
    password: string().required(errorMessages.required),
    email: string().email(errorMessages.invalid).required(errorMessages.required),
  });

  const resolver = useValidationResolver(schema);

  const formProps = useForm<FormData>({
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

  const onSubmit = async (formData: FormData) => {
    const result = await login(formData);
    const [hasErrors, errors] = extractMutationErrors<FormData>(result);

    if (hasErrors) {
      // api will attribute invalid credentials error to email but we'd
      // rather highlight both fields
      const fieldsErrors = errors.some(
        ({ code }) => (code as AccountErrorCode) === "INVALID_CREDENTIALS"
      )
        ? [...errors, { code: "", message: "", field: "password" } as ApiError<FormData>]
        : errors;

      setFormErrors<FormData>({ errors: getFormErrorsFromApiErrors(fieldsErrors), setError });
      showErrors(errors, "login");
      return;
    }

    onSignInSuccess();
  };

  const onPasswordReset = async () => {
    const { email } = getValues();

    clearErrors("password");

    try {
      await schema.validateAt("email", { email });

      const result = await requestPasswordReset({
        email,
        channel: checkout.channel.slug,
        redirectUrl: getCurrentHref(),
      });

      const [hasErrors, errors] = extractMutationErrors(result);

      if (hasErrors) {
        showErrors(errors, "requestPasswordReset");
        return;
      }

      if (!passwordResetSent) {
        setPasswordResetSent(true);
      }
    } catch (error) {
      const { path, type, message } = extractValidationError(error as ValidationError);

      setError(path, { type, message });
    }
  };

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
      <form onSubmit={handleSubmit(onSubmit)}>
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
            onClick={onPasswordReset}
          />
          <Button
            disabled={authenticating}
            ariaLabel={formatMessage(contactLabels.signIn)}
            onClick={handleSubmit(onSubmit)}
            label={formatMessage(
              authenticating ? commonMessages.processing : contactMessages.signIn
            )}
          />
        </div>
      </form>
    </SignInFormContainer>
  );
};
