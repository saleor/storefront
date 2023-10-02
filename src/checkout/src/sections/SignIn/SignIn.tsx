import React from "react";
import { Button } from "@/checkout/src/components/Button";
import { PasswordInput } from "@/checkout/src/components/PasswordInput";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { TextInput } from "@/checkout/src/components/TextInput";
import { commonMessages } from "@/checkout/src/lib/commonMessages";
import { useSignInForm } from "@/checkout/src/sections/SignIn/useSignInForm";
import { usePasswordResetRequest } from "@/checkout/src/sections/SignIn/usePasswordResetRequest";
import { contactLabels, contactMessages } from "@/checkout/src/sections/Contact/messages";
import { FormProvider } from "@/checkout/src/hooks/useForm/FormProvider";
import {
	SignInFormContainer,
	type SignInFormContainerProps,
} from "@/checkout/src/sections/Contact/SignInFormContainer";
import { isValidEmail } from "@/checkout/src/lib/utils/common";
import { useErrorMessages } from "@/checkout/src/hooks/useErrorMessages";
import { useCheckout } from "@/checkout/src/hooks/useCheckout";

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
						disabled={isSubmitting}
						ariaLabel={formatMessage(contactLabels.sendResetLink)}
						variant="tertiary"
						label={formatMessage(passwordResetSent ? contactMessages.resend : contactMessages.forgotPassword)}
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
