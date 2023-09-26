import React from "react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { SignInFormContainer, type SignInFormContainerProps } from "../Contact/SignInFormContainer";
import { contactLabels, contactMessages } from "../Contact/messages";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { Text } from "@/checkout/ui-kit";
import { Button } from "@/checkout/src/components/Button";
import { useUser } from "@/checkout/src/hooks/useUser";

interface SignedInUserProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
	onSignOutSuccess: () => void;
}

export const SignedInUser: React.FC<SignedInUserProps> = ({ onSectionChange, onSignOutSuccess }) => {
	const formatMessage = useFormattedMessages();
	const { signOut } = useSaleorAuthContext();

	const { user } = useUser();

	const handleLogout = async () => {
		signOut();
		onSignOutSuccess();
	};

	return (
		<SignInFormContainer title={formatMessage(contactMessages.account)} onSectionChange={onSectionChange}>
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
