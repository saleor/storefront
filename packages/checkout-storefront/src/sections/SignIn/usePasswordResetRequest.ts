import { useRequestPasswordResetMutation } from "@/checkout-storefront/graphql";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit/useSubmit";
import { getCurrentHref } from "@/checkout-storefront/lib/utils/locale";
import { contactMessages } from "@/checkout-storefront/sections/Contact/messages";
import { useEffect, useState } from "react";

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
