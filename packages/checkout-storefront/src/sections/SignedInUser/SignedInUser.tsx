import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import React from "react";
import { SignInFormContainer, SignInFormContainerProps } from "../Contact/SignInFormContainer";
import { Text } from "@saleor/ui-kit";
import { Button } from "@/checkout-storefront/components/Button";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { contactLabels, contactMessages } from "../Contact/messages";
import { useUser } from "@/checkout-storefront/hooks/useUser";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";

interface SignedInUserProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
  onSignOutSuccess: () => void;
}

export const SignedInUser: React.FC<SignedInUserProps> = ({
  onSectionChange,
  onSignOutSuccess,
}) => {
  const formatMessage = useFormattedMessages();
  const { checkoutSignOut } = useSaleorAuthContext();

  const { checkout } = useCheckout();
  const { user } = useUser();

  const handleLogout = async () => {
    await checkoutSignOut({ checkoutId: checkout.id });
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
