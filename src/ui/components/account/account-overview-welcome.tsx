"use client";

import { useAccountUser } from "@/ui/components/account/account-context";

export function AccountOverviewWelcome() {
	const user = useAccountUser();
	const displayName = user.firstName || user.email.split("@")[0] || "";

	return (
		<div>
			<h1 className="text-2xl font-semibold tracking-tight">Welcome back, {displayName}</h1>
			<p className="mt-1 text-sm text-muted-foreground">Here is an overview of your account activity.</p>
		</div>
	);
}
