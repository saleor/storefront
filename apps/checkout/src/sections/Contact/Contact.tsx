import { useCheckout } from "@hooks/useCheckout";
import { getDataWithToken, getQueryVariables } from "@lib/utils";
import { useEffect } from "react";
import { useState } from "react";
import { AnonymousCustomerForm } from "./AnonymousCustomerForm";
import { SignInForm } from "./SignInForm";
import { SignedInUser } from "./SignedInUser";
import { useAuthState } from "@saleor/sdk";
import {
  useCheckoutCustomerAttachMutation,
  useCheckoutCustomerDetachMutation,
} from "@graphql";
import { ResetPassword } from "./ResetPassword";

type Section = "signedInUser" | "anonymousUser" | "signIn" | "resetPassword";

interface ContactProps {
  onEmailChange: (value: string) => void;
  email: string;
}

export const Contact = ({ onEmailChange, email }: ContactProps) => {
  const [currentSection, setCurrentSection] =
    useState<Section>("anonymousUser");

  const changeSection = (section: Section) => () => {
    if (isCurrentSection(section)) {
      return;
    }

    setCurrentSection(section);
  };

  const isCurrentSection = (section: Section) => currentSection === section;

  const [passwordResetShown, setPasswordResetShown] = useState(false);
  const [, customerAttatch] = useCheckoutCustomerAttachMutation();
  const [, customerDetach] = useCheckoutCustomerDetachMutation();

  const { authenticated, user } = useAuthState();
  const { checkout, loading } = useCheckout();

  const passwordResetToken = getQueryVariables().passwordResetToken;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (authenticated || checkout.user) {
      setCurrentSection("signedInUser");

      if (authenticated && checkout.user?.id !== user?.id) {
        customerAttatch(
          getDataWithToken({
            customerId: user?.id as string,
          })
        );
      }

      return;
    }

    if (passwordResetToken && !passwordResetShown) {
      setCurrentSection("resetPassword");
      setPasswordResetShown(true);
      return;
    }

    setCurrentSection("anonymousUser");
    if (checkout.user) {
      customerDetach(getDataWithToken());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, checkout, authenticated, passwordResetToken]);

  return (
    <div>
      {isCurrentSection("anonymousUser") && (
        <AnonymousCustomerForm
          defaultValues={{ email }}
          onEmailChange={onEmailChange}
          onSectionChange={changeSection("signIn")}
        />
      )}

      {isCurrentSection("signIn") && (
        <SignInForm
          onSectionChange={changeSection("anonymousUser")}
          onEmailChange={onEmailChange}
          defaultValues={{ email }}
        />
      )}

      {isCurrentSection("signedInUser") && (
        <SignedInUser onSectionChange={changeSection("anonymousUser")} />
      )}

      {isCurrentSection("resetPassword") && (
        <ResetPassword onSectionChange={changeSection("signIn")} />
      )}
    </div>
  );
};
