import { useState } from "react";
import { useRequestPasswordResetMutation } from "@/checkout/graphql";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useSubmit } from "@/checkout/hooks/useSubmit/useSubmit";
import { getCurrentHref } from "@/checkout/lib/utils/locale";

interface PasswordResetFormData {
	email: string;
	shouldAbort: () => Promise<boolean>;
}

export const usePasswordResetRequest = ({ email, shouldAbort }: PasswordResetFormData) => {
	const { showSuccess } = useAlerts();

	const [, requestPasswordReset] = useRequestPasswordResetMutation();

	const [passwordResetSentForEmail, setPasswordResetSentForEmail] = useState<string | null>(null);

	const onSubmit = useSubmit<{}, typeof requestPasswordReset>({
		scope: "requestPasswordReset",
		onSubmit: requestPasswordReset,
		shouldAbort,
		onSuccess: () => {
			setPasswordResetSentForEmail(email);
			showSuccess(`A magic link has been sent to ${email}`);
		},
		parse: ({ channel }) => ({ email, redirectUrl: getCurrentHref(), channel }),
	});

	const passwordResetSent = passwordResetSentForEmail === email;

	return {
		onPasswordResetRequest: () => {
			void onSubmit();
		},
		passwordResetSent,
	};
};
