import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { clearQueryParams, getQueryParams } from "@/checkout-storefront/lib/utils/url";
import { useAuth } from "@saleor/sdk";
import { object, string } from "yup";

interface ResetPasswordFormData {
  password: string;
}

export const useResetPasswordForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { errorMessages } = useErrorMessages();
  // @todo change to our own mutation once we rewrite auth
  const { setPassword } = useAuth();

  const validationSchema = object({
    password: string().required(errorMessages.required),
  });

  // @ts-expect-error because login comes from the sdk which is no longer
  // maintained so we'll eventually have to implement our own auth flow
  const onSubmit = useFormSubmit<ResetPasswordFormData, typeof setPassword>({
    onSubmit: setPassword,
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
