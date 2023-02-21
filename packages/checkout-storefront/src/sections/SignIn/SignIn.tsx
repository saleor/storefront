import { Button } from "@/checkout-storefront/components/Button";
import { PasswordInput } from "@/checkout-storefront/components/PasswordInput";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
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
import { isValidEmail } from "@/checkout-storefront/lib/utils/common";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";

interface SignInProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
  onSignInSuccess: () => void;
  onEmailChange: (email: string) => void;
  email: string;
}

export const SignIn: React.FC<SignInProps> = ({
  onSectionChange,
  onSignInSuccess,
  onEmailChange,
  email: initialEmail,
}) => {
  const {
    checkout: { email: checkoutEmail },
  } = useCheckout();
  const { errorMessages } = useErrorMessages();
  const formatMessage = useFormattedMessages();

  const form = useSignInForm({
    onSuccess: onSignInSuccess,
    initialEmail: initialEmail || checkoutEmail || "",
  });

  const {
    values: { email },
    handleChange,
    setErrors,
    setTouched,
    isSubmitting,
  } = form;

  const { onPasswordResetRequest, passwordResetSent } = usePasswordResetRequest({
    email,
    shouldAbort: async () => {
      // @todo we'll use validateField once we fix it because
      // https://github.com/jaredpalmer/formik/issues/1755
      const isValid = await isValidEmail(email);

      if (!isValid) {
        await setTouched({ email: true });
        setErrors({ email: errorMessages.emailInvalid });
        return true;
      }
      setErrors({});

      return false;
    },
  });

  return (
    <SignInFormContainer
      title={formatMessage(contactMessages.signIn)}
      redirectSubtitle={formatMessage(contactMessages.newCustomer)}
      redirectButtonLabel={formatMessage(contactMessages.guestCheckout)}
      onSectionChange={onSectionChange}
    >
      <FormProvider form={form}>
        <TextInput
          name="email"
          label={formatMessage(contactMessages.email)}
          onChange={(event) => {
            handleChange(event);
            onEmailChange(event.target.value);
          }}
        />
        <PasswordInput name="password" label={formatMessage(contactMessages.password)} />
        <div className="actions">
          <Button
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            ariaLabel={formatMessage(contactLabels.signIn)}
            label={formatMessage(isSubmitting ? commonMessages.processing : contactMessages.signIn)}
          />
        </div>
      </FormProvider>
    </SignInFormContainer>
  );
};
