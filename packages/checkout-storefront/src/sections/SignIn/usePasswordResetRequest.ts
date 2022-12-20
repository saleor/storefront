import { useRequestPasswordResetMutation } from "@/checkout-storefront/graphql";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { getCurrentHref } from "@/checkout-storefront/lib/utils/locale";
import { useEffect, useState } from "react";

interface PasswordResetFormData {
  email: string;
}

export const usePasswordResetRequest = ({ email }: PasswordResetFormData) => {
  const [, requestPasswordReset] = useRequestPasswordResetMutation();

  const [passwordResetSent, setPasswordResetSent] = useState(false);

  const { onSubmit } = useSubmit<PasswordResetFormData, typeof requestPasswordReset>({
    scope: "requestPasswordReset",
    onSubmit: requestPasswordReset,
    onEnter: ({ setFieldError }) => {
      setPasswordResetSent(true);
      setFieldError("password", undefined);
    },
    onSuccess: () => setPasswordResetSent(true),
    parse: ({ email, channel }) => ({ email, redirectUrl: getCurrentHref(), channel }),
  });

  const onPasswordResetRequest = () => onSubmit({ email });

  useEffect(() => {
    setPasswordResetSent(false);
  }, [email]);

  return { onPasswordResetRequest, passwordResetSent };
};
