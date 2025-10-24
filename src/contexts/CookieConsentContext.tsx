"use client";

import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react";
import type { CookieConsentData, CookieConsentCategory } from "@/types/cookie-consent";

const CONSENT_KEY = "sds-cookie-consent";

const getDefaultConsent = (): CookieConsentData => ({
	hasConsented: false,
	essential: true,
	youtube: false,
	timestamp: null,
});

const loadConsent = (): CookieConsentData => {
	if (typeof window === "undefined") {
		return getDefaultConsent();
	}

	try {
		const stored = localStorage.getItem(CONSENT_KEY);
		if (!stored) {
			return getDefaultConsent();
		}

		const parsed = JSON.parse(stored) as CookieConsentData;

		if (!parsed || typeof parsed !== "object") {
			return getDefaultConsent();
		}

		return parsed;
	} catch (error) {
		console.warn("Error loading cookie consent:", error);
		return getDefaultConsent();
	}
};

const saveConsentToStorage = (data: Partial<CookieConsentData>): CookieConsentData => {
	const consentData: CookieConsentData = {
		...data,
		hasConsented: true,
		essential: true,
		timestamp: new Date().toISOString(),
	} as CookieConsentData;

	if (typeof window !== "undefined") {
		try {
			localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
		} catch (error) {
			console.warn("Unable to save cookie consent preferences:", error);
		}
	}

	return consentData;
};

interface CookieConsentContextValue {
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

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
	const [consentData, setConsentData] = useState<CookieConsentData>(getDefaultConsent);
	const [showBanner, setShowBanner] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [mounted, setMounted] = useState(false);

	// Load consent on mount
	useEffect(() => {
		const loaded = loadConsent();
		setConsentData(loaded);
		setShowBanner(!loaded.hasConsented);
		setMounted(true);
	}, []);

	// Apply consent settings to document
	useEffect(() => {
		if (!mounted) return;

		if (consentData.youtube) {
			document.body.classList.remove("youtube-blocked");
			document.body.classList.add("youtube-enabled");
		} else {
			document.body.classList.add("youtube-blocked");
			document.body.classList.remove("youtube-enabled");
		}

		window.dispatchEvent(
			new CustomEvent("cookieConsentUpdated", {
				detail: consentData,
			})
		);
	}, [consentData, mounted]);

	const hasConsent = useCallback(
		(category: CookieConsentCategory): boolean => {
			return consentData[category] || false;
		},
		[consentData]
	);

	const acceptAll = useCallback(() => {
		const newConsent = saveConsentToStorage({
			essential: true,
			youtube: true,
		});
		setConsentData(newConsent);
		setShowBanner(false);
		setShowSettings(false);
	}, []);

	const acceptEssential = useCallback(() => {
		const newConsent = saveConsentToStorage({
			essential: true,
			youtube: false,
		});
		setConsentData(newConsent);
		setShowBanner(false);
	}, []);

	const saveSettings = useCallback((settings: Partial<CookieConsentData>) => {
		const newConsent = saveConsentToStorage({
			essential: true,
			...settings,
		});
		setConsentData(newConsent);
		setShowBanner(false);
		setShowSettings(false);
	}, []);

	const openSettings = useCallback(() => {
		setShowSettings(true);
	}, []);

	const closeSettings = useCallback(() => {
		setShowSettings(false);
	}, []);

	const value: CookieConsentContextValue = {
		consentData,
		hasConsent,
		acceptAll,
		acceptEssential,
		saveSettings,
		showBanner,
		showSettings,
		openSettings,
		closeSettings,
	};

	return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
};

export const useCookieConsent = () => {
	const context = useContext(CookieConsentContext);
	if (context === undefined) {
		throw new Error("useCookieConsent must be used within a CookieConsentProvider");
	}
	return context;
};
