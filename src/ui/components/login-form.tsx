"use client";

import { useSearchParams } from "next/navigation";
import { LoginMode } from "./auth/login-mode";
import { SetPasswordMode } from "./auth/set-password-mode";

export function LoginForm() {
	const searchParams = useSearchParams();
	const resetEmail = searchParams.get("email");
	const resetToken = searchParams.get("token");

	if (resetEmail && resetToken) {
		return <SetPasswordMode email={resetEmail} token={resetToken} />;
	}

	return <LoginMode />;
}
