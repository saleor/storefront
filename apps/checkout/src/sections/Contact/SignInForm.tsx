import { Button } from "@/components/Button";
import { PasswordInput } from "@/components/PasswordInput";
import { TextInput } from "@/components/TextInput";
import { Text } from "@/components/Text";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { useAuth } from "@saleor/sdk";
import React from "react";
import {
  SignInFormContainer,
  SignInFormContainerProps,
} from "./SignInFormContainer";
import {
  extractValidationError,
  getCurrentHref,
  useValidationResolver,
} from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetInputProps } from "@/hooks/useGetInputProps";
import { object, string, ValidationError } from "yup";
import { useErrorMessages } from "@/hooks/useErrorMessages";
import { useEffect } from "react";

interface SignInFormProps
  extends Pick<SignInFormContainerProps, "onSectionChange"> {
  onEmailChange: (value: string) => void;
  defaultValues: Partial<FormData>;
}

interface FormData {
  email: string;
  password: string;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  onSectionChange,
  onEmailChange,
  defaultValues,
}) => {
  const formatMessage = useFormattedMessages();
  const errorMessages = useErrorMessages();
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const { login, requestPasswordReset } = useAuth();

  const schema = object({
    password: string().required(errorMessages.requiredField),
    email: string()
      .email(errorMessages.invalidValue)
      .required(errorMessages.requiredField),
  });

  const resolver = useValidationResolver(schema);
  const { handleSubmit, getValues, watch, setError, clearErrors, ...rest } =
    useForm<FormData>({
      resolver,
      mode: "onBlur",
      defaultValues,
    });
  const getInputProps = useGetInputProps(rest);

  const onSubmit = async (formData: FormData) => login(formData);

  const onPasswordReset = async () => {
    const { email } = getValues();

    clearErrors("password");

    try {
      await schema.validateAt("email", { email });

      if (!passwordResetSent) {
        setPasswordResetSent(true);
      }

      requestPasswordReset({
        email,
        redirectUrl: getCurrentHref(),
      });
    } catch (error) {
      const { path, type, message } = extractValidationError(
        error as ValidationError
      );

      setError(path, { type, message });
    }
  };

  const emailValue = watch("email");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onEmailChange(emailValue), [emailValue]);

  return (
    <SignInFormContainer
      title={formatMessage("signIn")}
      redirectSubtitle={formatMessage("newCustomer")}
      redirectButtonLabel={formatMessage("guestCheckout")}
      onSectionChange={onSectionChange}
    >
      <TextInput
        label={formatMessage("emailLabel")}
        {...getInputProps("email")}
      />
      <PasswordInput
        label={formatMessage("passwordLabel")}
        {...getInputProps("password")}
      />
      <div className="actions">
        {passwordResetSent && (
          <Text>{formatMessage("linkSent", { email: getValues().email })}</Text>
        )}
        <Button
          ariaLabel={formatMessage("sendPasswordLabel")}
          variant="tertiary"
          title={formatMessage(passwordResetSent ? "resend" : "forgotPassword")}
          className="ml-1 mr-4"
          onClick={onPasswordReset}
        />
        <Button
          ariaLabel={formatMessage("signInLabel")}
          onClick={handleSubmit(onSubmit)}
          title={formatMessage("signIn")}
        />
      </div>
    </SignInFormContainer>
  );
};
