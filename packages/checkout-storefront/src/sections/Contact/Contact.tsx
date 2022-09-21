import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { extractMutationErrors, getQueryVariables } from "@/checkout-storefront/lib/utils";
import React, { FC, useEffect, useRef } from "react";
import { useState } from "react";
import { SignInForm } from "./SignInForm";
import { SignedInUser } from "./SignedInUser";
import { useAuthState } from "@saleor/sdk";
import { ResetPassword } from "./ResetPassword";
import { GuestUserForm } from "./GuestUserForm";
import {
  useCheckoutCustomerAttachMutation,
  useCheckoutEmailUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useFormContext } from "react-hook-form";
import { useCheckoutUpdateStateTrigger } from "@/checkout-storefront/hooks";

type Section = "signedInUser" | "guestUser" | "signIn" | "resetPassword";

interface ContactProps {
  setShowOnlyContact: (value: boolean) => void;
}

export const Contact: FC<ContactProps> = ({ setShowOnlyContact }) => {
  const [passwordResetShown, setPasswordResetShown] = useState(false);
  const passwordResetToken = getQueryVariables().passwordResetToken;
  const shouldShowPasswordReset = passwordResetToken && !passwordResetShown;
  const [currentSection, setCurrentSection] = useState<Section>(
    shouldShowPasswordReset ? "resetPassword" : "guestUser"
  );
  const [{ fetching: attachingCustomer }, customerAttach] = useCheckoutCustomerAttachMutation();
  const [{ fetching: updatingEmail }, updateEmail] = useCheckoutEmailUpdateMutation();

  useCheckoutUpdateStateTrigger("checkoutEmailUpdate", updatingEmail);
  useCheckoutUpdateStateTrigger("checkoutCustomerAttach", attachingCustomer);

  const { showErrors } = useAlerts();
  const { authenticated, user } = useAuthState();
  const hasAuthenticated = useRef(false);
  const { checkout, loading } = useCheckout();
  const { getValues } = useFormContext();

  const handleChangeSection = (section: Section) => () => setCurrentSection(section);

  const isCurrentSection = (section: Section) => currentSection === section;

  const handleEmailUpdate = async (email: string) => {
    if (updatingEmail || !email?.length) {
      return;
    }

    const result = await updateEmail({
      email,
      checkoutId: checkout.id,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      showErrors(errors, "checkoutEmailUpdate");
      return;
    }
  };

  const updateEmailAfterSignIn = async () => {
    if (!user?.email || user?.email === checkout?.email) {
      return;
    }

    await handleEmailUpdate(user?.email);
  };

  const updateEmailAfterSectionChange = async () => {
    const formEmail = getValues("email");

    if (formEmail !== checkout.email) {
      await handleEmailUpdate(formEmail);
    }
  };

  const handleCustomerAttatch = async () => {
    if (checkout?.user?.id === user?.id || attachingCustomer) {
      return;
    }

    await customerAttach({
      checkoutId: checkout.id,
    });
  };

  useEffect(() => {
    if (authenticated && !hasAuthenticated.current) {
      void updateEmailAfterSignIn();
      void handleCustomerAttatch();
      hasAuthenticated.current = true;
    }
  }, [authenticated]);

  useEffect(() => {
    if (authenticated) {
      return;
    }

    if (isCurrentSection("guestUser")) {
      void updateEmailAfterSectionChange();
    }
  }, [currentSection]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (authenticated) {
      setCurrentSection("signedInUser");
      hasAuthenticated.current = true;
      return;
    }

    if (shouldShowPasswordReset) {
      setPasswordResetShown(true);
      return;
    }

    setCurrentSection("guestUser");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, checkout?.user, authenticated]);

  useEffect(() => {
    const shouldShowOnlyContact = isCurrentSection("resetPassword") || isCurrentSection("signIn");
    setShowOnlyContact(shouldShowOnlyContact);
  }, [currentSection]);

  return (
    <div>
      {isCurrentSection("guestUser") && (
        <GuestUserForm onSectionChange={handleChangeSection("signIn")} />
      )}

      {isCurrentSection("signIn") && (
        <SignInForm onSectionChange={handleChangeSection("guestUser")} />
      )}

      {isCurrentSection("signedInUser") && (
        <SignedInUser onSectionChange={handleChangeSection("guestUser")} />
      )}

      {isCurrentSection("resetPassword") && (
        <ResetPassword onSectionChange={handleChangeSection("signIn")} />
      )}
    </div>
  );
};
