import { Button } from "@/checkout-storefront/components/Button";
import { PasswordInput } from "@/checkout-storefront/components/PasswordInput";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import { useValidationResolver } from "@/checkout-storefront/lib/utils";
import { contactLabels, contactMessages } from "./messages";
import React from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { SignInFormContainer, SignInFormContainerProps } from "./SignInFormContainer";
import { clearQueryParams, getQueryParams } from "@/checkout-storefront/lib/utils/url";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { usePasswordResetMutation } from "@/checkout-storefront/graphql";

interface ResetPasswordProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
  onResetPasswordSuccess: () => void;
}

interface ResetPasswordFormData {
  password: string;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({
  onSectionChange,
  onResetPasswordSuccess,
}) => {
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();

  const [, passwordReset] = usePasswordResetMutation();

  const schema = object({
    password: string().required(errorMessages.required),
  });

  const resolver = useValidationResolver(schema);
  const { handleSubmit, ...rest } = useForm<ResetPasswordFormData>({ resolver });

  const getInputProps = useGetInputProps(rest);

  const onSubmit = useSubmit<ResetPasswordFormData, typeof passwordReset>({
    onSubmit: passwordReset,
    scope: "resetPassword",
    formDataParse: ({ password }) => {
      const { passwordResetEmail, passwordResetToken } = getQueryParams();
      return { password, email: passwordResetEmail || "", token: passwordResetToken || "" };
    },
    onSuccess: () => {
      clearQueryParams("passwordResetToken", "passwordResetEmail");
      onResetPasswordSuccess();
    },
  });

  return (
    <SignInFormContainer
      title={formatMessage(contactMessages.resetPassword)}
      redirectSubtitle={formatMessage(contactMessages.rememberedYourPassword)}
      redirectButtonLabel={formatMessage(contactMessages.signIn)}
      onSectionChange={onSectionChange}
      subtitle={formatMessage(contactMessages.providePassword)}
    >
      <PasswordInput
        label={formatMessage(contactMessages.password)}
        {...getInputProps("password")}
      />
      <div className="mt-4 actions">
        <Button
          ariaLabel={formatMessage(contactLabels.resetPassword)}
          onClick={handleSubmit(onSubmit)}
          label={formatMessage(contactMessages.resetPassword)}
        />
      </div>
    </SignInFormContainer>
  );
};
