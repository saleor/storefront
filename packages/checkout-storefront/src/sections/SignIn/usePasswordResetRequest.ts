import { useRequestPasswordResetMutation } from "@/checkout-storefront/graphql";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit/useSubmit";
import { getCurrentHref } from "@/checkout-storefront/lib/utils/locale";
import { useEffect, useState } from "react";

interface PasswordResetFormData {
  email: string;
  shouldAbort: () => Promise<boolean>;
}

export const usePasswordResetRequest = ({ email, shouldAbort }: PasswordResetFormData) => {
  const [, requestPasswordReset] = useRequestPasswordResetMutation();

  const [passwordResetSent, setPasswordResetSent] = useState(false);

  const onSubmit = useSubmit<{}, typeof requestPasswordReset>({
    scope: "requestPasswordReset",
    onSubmit: requestPasswordReset,
    shouldAbort,
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
