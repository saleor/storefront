import { useFormattedMessages } from "@hooks/useFormattedMessages";
import React from "react";
import {
  SignInFormContainer,
  SignInFormContainerProps,
} from "./SignInFormContainer";
import { Text } from "@components/Text";
import { useAuth, useAuthState } from "@saleor/sdk";
import { Button } from "@components/Button";

type SignedInUserProps = Pick<SignInFormContainerProps, "onSectionChange">;

export const SignedInUser: React.FC<SignedInUserProps> = ({
  onSectionChange,
}) => {
  const formatMessage = useFormattedMessages();
  const { logout } = useAuth();
  const { user } = useAuthState();

  return (
    <SignInFormContainer
      title={formatMessage("account")}
      onSectionChange={onSectionChange}
    >
      <div className="flex flex-row justify-between">
        <Text weight="bold">{user?.email}</Text>
        <Button
          ariaLabel={formatMessage("signOutLabel")}
          variant="tertiary"
          onClick={() => logout()}
          title={formatMessage("signOut")}
        />
      </div>
    </SignInFormContainer>
  );
};
