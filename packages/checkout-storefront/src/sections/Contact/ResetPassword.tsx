import { Button } from "@/checkout-storefront/components/Button";
import { PasswordInput } from "@/checkout-storefront/components/PasswordInput";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import {
  extractMutationErrors,
  getQueryVariables,
  useValidationResolver,
} from "@/checkout-storefront/lib/utils";
import { labels, messages } from "@/checkout-storefront/sections/Contact/messages";
import { useAuth } from "@saleor/sdk";
import React from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { SignInFormContainer, SignInFormContainerProps } from "./SignInFormContainer";

type ResetPasswordProps = Pick<SignInFormContainerProps, "onSectionChange">;

interface FormData {
  password: string;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onSectionChange }) => {
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();
  const { setPassword: resetPassword } = useAuth();
  const { showErrors } = useAlerts("resetPassword");

  const schema = object({
    password: string().required(errorMessages.required),
  });

  const resolver = useValidationResolver(schema);
  const { handleSubmit, ...rest } = useForm<FormData>({ resolver });

  const getInputProps = useGetInputProps(rest);

  const onSubmit = async ({ password }: FormData) => {
    const { email, passwordResetToken } = getQueryVariables();

    const result = await resetPassword({
      password,
      email: email as string,
      token: passwordResetToken as string,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      showErrors(errors);
    }
  };

  return (
    <SignInFormContainer
      title={formatMessage(messages.resetPassword)}
      redirectSubtitle={formatMessage(messages.rememberedYourPassword)}
      redirectButtonLabel={formatMessage(messages.signIn)}
      onSectionChange={onSectionChange}
      subtitle={formatMessage(messages.providePassword)}
    >
      <PasswordInput label={formatMessage(messages.password)} {...getInputProps("password")} />
      <div className="mt-4 actions">
        <Button
          ariaLabel={formatMessage(labels.resetPassword)}
          onClick={handleSubmit(onSubmit)}
          label={formatMessage(messages.resetPassword)}
        />
      </div>
    </SignInFormContainer>
  );
};
