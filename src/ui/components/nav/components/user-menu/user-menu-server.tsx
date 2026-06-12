import { cookies } from "next/headers";

import { getHeaderAuthState } from "@/lib/auth/get-header-user";

import { UserMenu } from "./user-menu";
import { UserMenuLoginLink } from "./user-menu-login-link";
import { UserMenuUnavailable } from "./user-menu-unavailable";

export async function UserMenuServer({ locale, channel }: { locale: string; channel: string }) {
	// Request-dynamic under PPR — never serve a prerendered anonymous menu when cookies exist.
	await cookies();

	const auth = await getHeaderAuthState();

	switch (auth.status) {
		case "authenticated":
			return <UserMenu user={auth.user} />;
		case "unavailable":
			return <UserMenuUnavailable />;
		case "guest":
			return <UserMenuLoginLink locale={locale} channel={channel} />;
	}
}
