import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import React from "react";
import { SignInFormContainer, SignInFormContainerProps } from "../Contact/SignInFormContainer";
import { Text } from "@saleor/ui-kit";
import { Button } from "@/checkout-storefront/components/Button";
import { useCheckoutCustomerDetachMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { contactLabels, contactMessages } from "../Contact/messages";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { localeToLanguageCode } from "@/checkout-storefront/lib/utils/locale";
import { useAuth } from "@/checkout-storefront/lib/auth/useAuth";
import { useUser } from "@/checkout-storefront/hooks/useUser";

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
  const { user } = useUser();

  const [, customerDetach] = useCheckoutCustomerDetachMutation();

  const handleLogout = async () => {
    await customerDetach({ languageCode: localeToLanguageCode(locale), checkoutId: checkout.id });
    logout();
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
