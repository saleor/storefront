"use client";

import { useSearchParams } from "next/navigation";
import { getEmailAndTokenFromSearchParams } from "@/lib/auth/account-confirmation-url";
import { LoginMode } from "./auth/login-mode";
import { SetPasswordMode } from "./auth/set-password-mode";

export function LoginForm() {
	const searchParams = useSearchParams();
	const credentials = getEmailAndTokenFromSearchParams(searchParams);

	if (credentials) {
		return <SetPasswordMode email={credentials.email} token={credentials.token} />;
	}

	return <LoginMode />;
}
