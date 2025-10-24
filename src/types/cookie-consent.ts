export interface CookieConsentData {
	hasConsented: boolean;
	essential: boolean;
	youtube: boolean;
	timestamp: string | null;
}

export type CookieConsentCategory = "essential" | "youtube";

export interface CookieConsentContextValue {
	consentData: CookieConsentData;
	hasConsent: (category: CookieConsentCategory) => boolean;
	acceptAll: () => void;
	acceptEssential: () => void;
	saveSettings: (settings: Partial<CookieConsentData>) => void;
	showBanner: boolean;
	showSettings: boolean;
	openSettings: () => void;
	closeSettings: () => void;
}
