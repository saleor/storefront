import React from "react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { SignInFormContainer, type SignInFormContainerProps } from "../Contact/SignInFormContainer";
import { contactLabels, contactMessages } from "../Contact/messages";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { Button } from "@/checkout/components/Button";
import { useUser } from "@/checkout/hooks/useUser";

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
				<p className="text-base font-bold">{user?.email}</p>
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
