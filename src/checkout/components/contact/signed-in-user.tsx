"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import { detachCheckoutCustomer } from "@/app/(checkout)/actions";
import { useLogout } from "@/lib/auth/use-logout";

export interface SignedInUserProps {
	/** User email or basic info */
	user: { email: string };
	checkoutId?: string;
	/** Called after sign-out */
	onSignOut: () => void;
}

/**
 * Displays signed-in user info with sign-out option.
 */
export const SignedInUser: FC<SignedInUserProps> = ({ user, checkoutId, onSignOut }) => {
	const t = useTranslations("checkout.contact");
	const tNav = useTranslations("account.nav");
	const logout = useLogout();

	const handleSignOut = async () => {
		if (checkoutId) {
			await detachCheckoutCustomer(checkoutId);
		}
		await logout({ stayOnPage: true });
		onSignOut();
	};

	return (
		<div className="bg-muted/30 flex items-center gap-3 rounded-lg border border-border p-4">
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
				{user.email.charAt(0).toUpperCase()}
			</div>
			<div className="flex h-10 min-w-0 flex-1 flex-col justify-between">
				<p className="truncate font-medium leading-tight" title={user.email}>
					{user.email}
				</p>
				<div className="flex items-center justify-between gap-3 text-sm leading-tight text-muted-foreground">
					<span>{t("signedIn")}</span>
					<button
						type="button"
						onClick={() => void handleSignOut()}
						className="shrink-0 underline underline-offset-2 hover:text-foreground hover:no-underline"
					>
						{tNav("signOut")}
					</button>
				</div>
			</div>
		</div>
	);
};
