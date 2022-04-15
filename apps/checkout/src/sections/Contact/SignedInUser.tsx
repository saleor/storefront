import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import React from "react";
import {
  SignInFormContainer,
  SignInFormContainerProps,
} from "./SignInFormContainer";
import { Text } from "@/components/Text";
import { useAuth, useAuthState } from "@saleor/sdk";
import { Button } from "@/components/Button";
import { useCheckoutCustomerDetachMutation } from "@/graphql";
import { getDataWithToken } from "@/lib/utils";

type SignedInUserProps = Pick<SignInFormContainerProps, "onSectionChange">;

export const SignedInUser: React.FC<SignedInUserProps> = ({
  onSectionChange,
}) => {
  const formatMessage = useFormattedMessages();
  const { logout } = useAuth();
  const { user } = useAuthState();
  const [, customerDetach] = useCheckoutCustomerDetachMutation();

  const handleLogout = async () => {
    await customerDetach(getDataWithToken());
    await logout();
  };

  return (
    <SignInFormContainer
      title={formatMessage("account")}
      onSectionChange={onSectionChange}
    >
      <div className="flex flex-row justify-between">
        <Text weight="bold" size="md">
          {user?.email}
        </Text>
        <Button
          ariaLabel={formatMessage("signOutLabel")}
          variant="tertiary"
          onClick={handleLogout}
          title={formatMessage("signOut")}
        />
      </div>
    </SignInFormContainer>
  );
};
