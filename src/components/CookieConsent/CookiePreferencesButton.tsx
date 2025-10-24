"use client";

import { CookieIcon } from "./CookieIcon";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export const CookiePreferencesButton = () => {
	const { openSettings } = useCookieConsent();

	return (
		<button
			onClick={openSettings}
			className="group inline-flex items-center gap-2 text-sm text-base-400 transition-colors duration-200 hover:text-accent-200"
			aria-label="Manage cookie preferences"
		>
			<CookieIcon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
			<span>Cookie Preferences</span>
		</button>
	);
};
