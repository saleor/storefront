import { Button } from "@/checkout-storefront/components/Button";
import { PasswordInput } from "@/checkout-storefront/components/PasswordInput";
import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useAuth } from "@saleor/sdk";
import React from "react";
import { SignInFormContainer, SignInFormContainerProps } from "./SignInFormContainer";
import {
  extractMutationErrors,
  extractValidationError,
  getCurrentHref,
  useValidationResolver,
} from "@/checkout-storefront/lib/utils";
import { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import { object, string, ValidationError } from "yup";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { useEffect } from "react";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { labels, messages } from "@/checkout-storefront/sections/Contact/messages";

type SignInFormProps = Pick<SignInFormContainerProps, "onSectionChange">;

interface FormData {
  email: string;
  password: string;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSectionChange }) => {
  const formatMessage = useFormattedMessages();
  const { showErrors } = useAlerts();
  const { errorMessages } = useErrorMessages();
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const { login, requestPasswordReset } = useAuth();
  const { getValues: getContextValues, setValue: setContextValue } = useFormContext();

  const schema = object({
    password: string().required(errorMessages.required),
    email: string().email(errorMessages.invalid).required(errorMessages.required),
  });

  const resolver = useValidationResolver(schema);

  const { handleSubmit, getValues, watch, setError, clearErrors, ...rest } = useForm<FormData>({
    resolver,
    mode: "onBlur",
    defaultValues: { email: getContextValues("email") },
  });

  const getInputProps = useGetInputProps(rest);

  const onSubmit = async (formData: FormData) => {
    const result = await login(formData);
    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      showErrors(errors, "login");
      return;
    }
  };

  const onPasswordReset = async () => {
    const { email } = getValues();

    clearErrors("password");

    try {
      await schema.validateAt("email", { email });

      const result = await requestPasswordReset({
        email,
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setContextValue("email", emailValue), [emailValue]);

  return (
    <SignInFormContainer
      title={formatMessage(messages.signIn)}
      redirectSubtitle={formatMessage(messages.newCustomer)}
      redirectButtonLabel={formatMessage(messages.guestCheckout)}
      onSectionChange={onSectionChange}
    >
      <TextInput label={formatMessage(messages.email)} {...getInputProps("email")} />
      <PasswordInput label={formatMessage(messages.password)} {...getInputProps("password")} />
      <div className="actions">
        {passwordResetSent && (
          <Text>{formatMessage(messages.linkSent, { email: getValues().email })}</Text>
        )}
        <Button
          ariaLabel={formatMessage(labels.sendResetLink)}
          variant="tertiary"
          label={formatMessage(passwordResetSent ? messages.resend : messages.forgotPassword)}
          className="ml-1 mr-4"
          onClick={onPasswordReset}
        />
        <Button
          ariaLabel={formatMessage(labels.signIn)}
          onClick={handleSubmit(onSubmit)}
          label={formatMessage(messages.signIn)}
        />
      </div>
    </SignInFormContainer>
  );
};
