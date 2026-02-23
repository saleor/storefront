"use client";

import { createContext, use } from "react";
import { type AccountUser } from "@/app/[channel]/(main)/account/get-current-user";

const AccountContext = createContext<AccountUser | null>(null);

export function AccountProvider({ user, children }: { user: AccountUser; children: React.ReactNode }) {
	return <AccountContext value={user}>{children}</AccountContext>;
}

export function useAccountUser(): AccountUser {
	const user = use(AccountContext);
	if (!user) {
		throw new Error("useAccountUser must be used within an AccountProvider");
	}
	return user;
}
