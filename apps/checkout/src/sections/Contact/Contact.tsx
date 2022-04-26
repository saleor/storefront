import { useCheckout } from "@/hooks/useCheckout";
import { getDataWithToken, getQueryVariables } from "@/lib/utils";
import React, { useEffect } from "react";
import { useState } from "react";
import { SignInForm } from "./SignInForm";
import { SignedInUser } from "./SignedInUser";
import { useAuthState } from "@saleor/sdk";
import { useCheckoutCustomerAttachMutation } from "@/graphql";
import { ResetPassword } from "./ResetPassword";
import { GuestUserForm } from "./GuestUserForm";

type Section = "signedInUser" | "guestUser" | "signIn" | "resetPassword";

export const Contact = () => {
  const [currentSection, setCurrentSection] = useState<Section>("guestUser");

  const changeSection = (section: Section) => () => {
    if (isCurrentSection(section)) {
      return;
    }

    setCurrentSection(section);
  };

  const isCurrentSection = (section: Section) => currentSection === section;

  const [passwordResetShown, setPasswordResetShown] = useState(false);
  const [, customerAttach] = useCheckoutCustomerAttachMutation();

  const { authenticated, user } = useAuthState();
  const { checkout, loading } = useCheckout();

  const passwordResetToken = getQueryVariables().passwordResetToken;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (authenticated) {
      setCurrentSection("signedInUser");

      if (checkout?.user?.id !== user?.id) {
        customerAttach(getDataWithToken());
      }

      return;
    }

    if (passwordResetToken && !passwordResetShown) {
      setCurrentSection("resetPassword");
      setPasswordResetShown(true);
      return;
    }

    setCurrentSection("guestUser");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, checkout?.user, authenticated, passwordResetToken]);

  return (
    <div>
      {isCurrentSection("guestUser") && (
        <GuestUserForm onSectionChange={changeSection("signIn")} />
      )}

      {isCurrentSection("signIn") && (
        <SignInForm onSectionChange={changeSection("guestUser")} />
      )}

      {isCurrentSection("signedInUser") && (
        <SignedInUser onSectionChange={changeSection("guestUser")} />
      )}

      {isCurrentSection("resetPassword") && (
        <ResetPassword onSectionChange={changeSection("signIn")} />
      )}
    </div>
  );
};
