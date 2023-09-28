import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { object, string } from "yup";
import { useErrorMessages } from "@/checkout/src/hooks/useErrorMessages";
import { useForm } from "@/checkout/src/hooks/useForm";
import { useFormSubmit } from "@/checkout/src/hooks/useFormSubmit";
import { clearQueryParams, getQueryParams } from "@/checkout/src/lib/utils/url";

interface ResetPasswordFormData {
	password: string;
}

export const useResetPasswordForm = ({ onSuccess }: { onSuccess: () => void }) => {
	const { errorMessages } = useErrorMessages();
	const { resetPassword } = useSaleorAuthContext();

	const validationSchema = object({
		password: string().required(errorMessages.required),
	});

	const onSubmit = useFormSubmit<ResetPasswordFormData, typeof resetPassword>({
		onSubmit: resetPassword,
		scope: "resetPassword",
		parse: ({ password }) => {
			const { passwordResetEmail, passwordResetToken } = getQueryParams();
			return { password, email: passwordResetEmail || "", token: passwordResetToken || "" };
		},
		onSuccess: () => {
			clearQueryParams("passwordResetToken", "passwordResetEmail");
			onSuccess();
		},
	});

	const initialValues: ResetPasswordFormData = { password: "" };

	const form = useForm<ResetPasswordFormData>({
		initialValues,
		onSubmit,
		validationSchema,
	});

	return form;
};
