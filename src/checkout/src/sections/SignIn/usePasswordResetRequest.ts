import { useEffect, useState } from "react";
import { useRequestPasswordResetMutation } from "@/checkout/src/graphql";
import { useAlerts } from "@/checkout/src/hooks/useAlerts";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { useSubmit } from "@/checkout/src/hooks/useSubmit/useSubmit";
import { getCurrentHref } from "@/checkout/src/lib/utils/locale";
import { contactMessages } from "@/checkout/src/sections/Contact/messages";

interface PasswordResetFormData {
	email: string;
	shouldAbort: () => Promise<boolean>;
}

export const usePasswordResetRequest = ({ email, shouldAbort }: PasswordResetFormData) => {
	const formatMessage = useFormattedMessages();
	const { showSuccess } = useAlerts();

	const [, requestPasswordReset] = useRequestPasswordResetMutation();

	const [passwordResetSent, setPasswordResetSent] = useState(false);

	const onSubmit = useSubmit<{}, typeof requestPasswordReset>({
		scope: "requestPasswordReset",
		onSubmit: requestPasswordReset,
		shouldAbort,
		onSuccess: () => {
			setPasswordResetSent(true);
			showSuccess(formatMessage(contactMessages.linkSent, { email }));
		},
		parse: ({ channel }) => ({ email, redirectUrl: getCurrentHref(), channel }),
	});

	useEffect(() => {
		setPasswordResetSent(false);
	}, [email]);

	return {
		onPasswordResetRequest: () => {
			void onSubmit();
		},
		passwordResetSent,
	};
};
