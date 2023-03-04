import { Button } from "@/checkout-storefront/components/Button";
import { PasswordInput } from "@/checkout-storefront/components/PasswordInput";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { contactLabels, contactMessages } from "../Contact/messages";
import React from "react";
import { SignInFormContainer, SignInFormContainerProps } from "../Contact/SignInFormContainer";
import { useResetPasswordForm } from "@/checkout-storefront/sections/ResetPassword/useResetPasswordForm";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";

interface ResetPasswordProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
  onResetPasswordSuccess: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({
  onSectionChange,
  onResetPasswordSuccess,
}) => {
  const formatMessage = useFormattedMessages();
  const form = useResetPasswordForm({ onSuccess: onResetPasswordSuccess });

  return (
    <SignInFormContainer
      title={formatMessage(contactMessages.resetPassword)}
      redirectSubtitle={formatMessage(contactMessages.rememberedYourPassword)}
      redirectButtonLabel={formatMessage(contactMessages.signIn)}
      onSectionChange={onSectionChange}
      subtitle={formatMessage(contactMessages.providePassword)}
    >
      <FormProvider form={form}>
        <PasswordInput name="password" label={formatMessage(contactMessages.password)} />
        <div className="mt-4 actions">
          <Button
            ariaLabel={formatMessage(contactLabels.resetPassword)}
            label={formatMessage(contactMessages.resetPassword)}
            type="submit"
          />
        </div>
      </FormProvider>
    </SignInFormContainer>
  );
};
