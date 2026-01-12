"use client";

import { type FC } from "react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";

export interface SignedInUserProps {
	/** User email or basic info */
	user: { email: string };
	/** Called after sign-out */
	onSignOut: () => void;
}

/**
 * Displays signed-in user info with sign-out option.
 *
 * Shows:
 * - User avatar (first letter of email)
 * - Email address
 * - "Signed in" status
 * - Sign out button
 */
export const SignedInUser: FC<SignedInUserProps> = ({ user, onSignOut }) => {
	const { signOut } = useSaleorAuthContext();

	const handleSignOut = () => {
		signOut();
		onSignOut();
	};

	return (
		<div className="bg-muted/30 flex items-center justify-between rounded-lg border border-border p-4">
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
					{user.email.charAt(0).toUpperCase()}
				</div>
				<div>
					<p className="font-medium">{user.email}</p>
					<p className="text-sm text-muted-foreground">Signed in</p>
				</div>
			</div>
			<button
				onClick={handleSignOut}
				className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline"
			>
				Sign out
			</button>
		</div>
	);
};
