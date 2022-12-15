import { usePasswordResetMutation } from "@/checkout-storefront/graphql";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { clearQueryParams, getQueryParams } from "@/checkout-storefront/lib/utils/url";
import { object, string } from "yup";

interface ResetPasswordFormData {
  password: string;
}

export const useResetPasswordForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [, passwordReset] = usePasswordResetMutation();
  const { errorMessages } = useErrorMessages();

  const validationSchema = object({
    password: string().required(errorMessages.required),
  });

  const { onSubmit } = useSubmit<ResetPasswordFormData, typeof passwordReset>({
    onSubmit: passwordReset,
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
