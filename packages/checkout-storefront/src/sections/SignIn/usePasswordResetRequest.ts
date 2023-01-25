import { useRequestPasswordResetMutation } from "@/checkout-storefront/graphql";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { getCurrentHref } from "@/checkout-storefront/lib/utils/locale";
import { useEffect, useState } from "react";

interface PasswordResetFormData {
  email: string;
  onRequest: () => void;
}

export const usePasswordResetRequest = ({ email, onRequest }: PasswordResetFormData) => {
  const [, requestPasswordReset] = useRequestPasswordResetMutation();

  const [passwordResetSent, setPasswordResetSent] = useState(false);

  const onSubmit = useSubmit<{}, typeof requestPasswordReset>({
    scope: "requestPasswordReset",
    onSubmit: requestPasswordReset,
    onStart: () => {
      setPasswordResetSent(true);
      onRequest();
    },
    onSuccess: () => setPasswordResetSent(true),
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
