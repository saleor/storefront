"use client";

import { type FC } from "react";
import { Label } from "@/ui/components/ui/label";
import { Checkbox } from "@/ui/components/ui/checkbox";
import { SignedInUser, GuestContact } from "@/checkout/components/contact";
import { isCheckoutMarketingConsentEnabled } from "@/checkout/lib/marketing-consent";

// User type matching what useUser() returns
type User = {
	id: string;
	email: string;
	firstName?: string | null;
	lastName?: string | null;
};

// =============================================================================
// Types
// =============================================================================

interface ContactSectionProps {
	// Auth state
	isSignedIn: boolean;
	user: User | null | undefined;
	checkoutId?: string;
	/** True while resolving session (avoids guest UI flash when auth cookies exist) */
	isLoading?: boolean;
	onSignOut: () => void;
	onSignInClick: () => void;

	// Email state (guests)
	email: string;
	onEmailChange: (value: string) => void;
	onEmailBlur: () => void;
	emailError?: string;

	// Create account state (guests)
	createAccount: boolean;
	onCreateAccountChange: (value: boolean) => void;
	password: string;
	onPasswordChange: (value: string) => void;
	passwordError?: string;

	// Subscribe state (guests)
	subscribeNews: boolean;
	onSubscribeChange: (value: boolean) => void;
}

// =============================================================================
// Component
// =============================================================================

export const ContactSection: FC<ContactSectionProps> = ({
	isSignedIn,
	user,
	checkoutId,
	isLoading = false,
	onSignOut,
	onSignInClick,
	email,
	onEmailChange,
	onEmailBlur,
	emailError,
	createAccount,
	onCreateAccountChange,
	password,
	onPasswordChange,
	passwordError,
	subscribeNews,
	onSubscribeChange,
}) => {
	if (isLoading) {
		return (
			<section className="space-y-4">
				<div className="h-7 w-24 animate-pulse rounded bg-muted" />
				<div className="h-16 animate-pulse rounded-lg bg-muted" />
			</section>
		);
	}

	return (
		<section className="space-y-4">
			{isSignedIn && user ? (
				<>
					<h2 className="text-xl font-semibold">Contact</h2>
					<SignedInUser user={user} checkoutId={checkoutId} onSignOut={onSignOut} />
				</>
			) : (
				<>
					<GuestContact
						email={email}
						onEmailChange={onEmailChange}
						onEmailBlur={onEmailBlur}
						emailError={emailError}
						onSignInClick={onSignInClick}
						createAccount={createAccount}
						onCreateAccountChange={onCreateAccountChange}
						password={password}
						onPasswordChange={onPasswordChange}
						passwordError={passwordError}
					/>

					{isCheckoutMarketingConsentEnabled() && (
						<div className="flex items-center gap-3">
							<Checkbox
								id="subscribe"
								checked={subscribeNews}
								onCheckedChange={(checked) => onSubscribeChange(checked === true)}
							/>
							<Label htmlFor="subscribe" className="cursor-pointer text-sm text-muted-foreground">
								Email me with news and offers
							</Label>
						</div>
					)}
				</>
			)}
		</section>
	);
};
