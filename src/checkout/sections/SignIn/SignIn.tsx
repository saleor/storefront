import React from "react";
import { Button } from "@/checkout/components/Button";
import { PasswordInput } from "@/checkout/components/PasswordInput";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { TextInput } from "@/checkout/components/TextInput";
import { commonMessages } from "@/checkout/lib/commonMessages";
import { useSignInForm } from "@/checkout/sections/SignIn/useSignInForm";
import { usePasswordResetRequest } from "@/checkout/sections/SignIn/usePasswordResetRequest";
import { contactLabels, contactMessages } from "@/checkout/sections/Contact/messages";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import {
	SignInFormContainer,
	type SignInFormContainerProps,
} from "@/checkout/sections/Contact/SignInFormContainer";
import { isValidEmail } from "@/checkout/lib/utils/common";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { useCheckout } from "@/checkout/hooks/useCheckout";

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
					required
					name="email"
					label={formatMessage(contactMessages.email)}
					onChange={(event) => {
						handleChange(event);
						onEmailChange(event.currentTarget.value);
					}}
				/>
				<PasswordInput name="password" label={formatMessage(contactMessages.password)} />
				<div className="flex w-full flex-row items-center justify-end">
					<Button
						ariaDisabled={isSubmitting}
						ariaLabel={formatMessage(contactLabels.sendResetLink)}
						variant="tertiary"
						label={formatMessage(passwordResetSent ? contactMessages.resend : contactMessages.forgotPassword)}
						className="ml-1 mr-4"
						onClick={(e) => (isSubmitting ? e.preventDefault() : onPasswordResetRequest)}
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
