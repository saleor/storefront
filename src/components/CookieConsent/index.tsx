"use client";

import { CookieBanner } from "./CookieBanner";
import { CookieSettingsModal } from "./CookieSettingsModal";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

export const CookieConsent = () => {
	const {
		consentData,
		showBanner,
		showSettings,
		acceptAll,
		acceptEssential,
		saveSettings,
		openSettings,
		closeSettings,
	} = useCookieConsent();

	return (
		<>
			{showBanner && (
				<CookieBanner
					onAcceptAll={acceptAll}
					onAcceptEssential={acceptEssential}
					onOpenSettings={openSettings}
				/>
			)}

			<CookieSettingsModal
				isOpen={showSettings}
				onClose={closeSettings}
				onSave={saveSettings}
				onAcceptAll={acceptAll}
				currentConsent={consentData}
			/>
		</>
	);
};

export { useCookieConsent } from "@/hooks/useCookieConsent";
export { CookiePreferencesButton } from "./CookiePreferencesButton";
export { CookieIcon } from "./CookieIcon";
export type { CookieConsentData, CookieConsentCategory } from "@/types/cookie-consent";
