import React from "react";
import { contactLabels, contactMessages } from "../Contact/messages";
import { SignInFormContainer, type SignInFormContainerProps } from "../Contact/SignInFormContainer";
import { Button } from "@/checkout/src/components/Button";
import { PasswordInput } from "@/checkout/src/components/PasswordInput";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { useResetPasswordForm } from "@/checkout/src/sections/ResetPassword/useResetPasswordForm";
import { FormProvider } from "@/checkout/src/hooks/useForm/FormProvider";

interface ResetPasswordProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
	onResetPasswordSuccess: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onSectionChange, onResetPasswordSuccess }) => {
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
				<div className="mt-4 flex w-full flex-row items-center justify-end">
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
