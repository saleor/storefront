import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import React from "react";
import { SignInFormContainer, SignInFormContainerProps } from "./SignInFormContainer";
import { Text } from "@saleor/ui-kit";
import { useAuth, useAuthState } from "@saleor/sdk";
import { Button } from "@/checkout-storefront/components/Button";
import { useCheckoutCustomerDetachMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { contactLabels, contactMessages } from "./messages";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { localeToLanguageCode } from "@/checkout-storefront/lib/utils";

interface SignedInUserProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
  onSignOutSuccess: () => void;
}

export const SignedInUser: React.FC<SignedInUserProps> = ({
  onSectionChange,
  onSignOutSuccess,
}) => {
  const formatMessage = useFormattedMessages();
  const { locale } = useLocale();

  const { checkout } = useCheckout();
  const { logout } = useAuth();
  const { user } = useAuthState();

  const [, customerDetach] = useCheckoutCustomerDetachMutation();

  const handleLogout = async () => {
    await customerDetach({ languageCode: localeToLanguageCode(locale), checkoutId: checkout.id });
    await logout();
    onSignOutSuccess();
  };

  return (
    <SignInFormContainer
      title={formatMessage(contactMessages.account)}
      onSectionChange={onSectionChange}
    >
      <div className="flex flex-row justify-between">
        <Text weight="bold" size="md">
          {user?.email}
        </Text>
        <Button
          ariaLabel={formatMessage(contactLabels.signOut)}
          variant="tertiary"
          onClick={handleLogout}
          label={formatMessage(contactMessages.signOut)}
        />
      </div>
    </SignInFormContainer>
  );
};
