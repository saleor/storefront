import { Button } from "@/checkout-storefront/components/Button";
import { PasswordInput } from "@/checkout-storefront/components/PasswordInput";
import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useAuthState } from "@saleor/sdk";
import React from "react";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { commonMessages } from "@/checkout-storefront/lib/commonMessages";
import { useSignInForm } from "@/checkout-storefront/sections/SignIn/useSignInForm";
import { usePasswordResetRequest } from "@/checkout-storefront/sections/SignIn/usePasswordResetRequest";
import { contactLabels, contactMessages } from "@/checkout-storefront/sections/Contact/messages";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";
import {
  SignInFormContainer,
  SignInFormContainerProps,
} from "@/checkout-storefront/sections/Contact/SignInFormContainer";

interface SignInProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
  onSignInSuccess: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSectionChange, onSignInSuccess }) => {
  const formatMessage = useFormattedMessages();
  const { authenticating } = useAuthState();
  const form = useSignInForm({ onSuccess: onSignInSuccess });
  const { onPasswordResetRequest, passwordResetSent } = usePasswordResetRequest({
    email: form.values.email,
    onRequest: () => form.setFieldError("password", undefined),
  });

  return (
    <SignInFormContainer
      title={formatMessage(contactMessages.signIn)}
      redirectSubtitle={formatMessage(contactMessages.newCustomer)}
      redirectButtonLabel={formatMessage(contactMessages.guestCheckout)}
      onSectionChange={onSectionChange}
    >
      <FormProvider form={form}>
        <TextInput name="email" label={formatMessage(contactMessages.email)} />
        <PasswordInput name="password" label={formatMessage(contactMessages.password)} />
        <div className="actions">
          {passwordResetSent && <Text>{formatMessage(contactMessages.linkSent, { email })}</Text>}
          <Button
            disabled={authenticating}
            ariaLabel={formatMessage(contactLabels.sendResetLink)}
            variant="tertiary"
            label={formatMessage(
              passwordResetSent ? contactMessages.resend : contactMessages.forgotPassword
            )}
            className="ml-1 mr-4"
            onClick={onPasswordResetRequest}
          />
          <Button
            type="submit"
            disabled={authenticating}
            ariaLabel={formatMessage(contactLabels.signIn)}
            label={formatMessage(
              authenticating ? commonMessages.processing : contactMessages.signIn
            )}
          />
        </div>
      </FormProvider>
    </SignInFormContainer>
  );
};
