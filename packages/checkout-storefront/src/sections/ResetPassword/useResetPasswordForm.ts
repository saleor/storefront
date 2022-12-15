import { usePasswordResetMutation } from "@/checkout-storefront/graphql";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { clearQueryParams, getQueryParams } from "@/checkout-storefront/lib/utils/url";

interface ResetPasswordFormData {
  password: string;
}

export const useResetPasswordForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [, passwordReset] = usePasswordResetMutation();

  // const schema = object({
  //     password: string().required(errorMessages.required),
  //   });

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

  const form = useForm({
    initialValues,
    onSubmit,
  });

  return form;
};
