"use client";

import Link from "next/link";
import { getLocalStorage, setLocalStorage } from "@/lib/storageHelper";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useState<boolean>(() => {
    const storedCookieConsent = getLocalStorage("cookie_consent", false);
    console.log("Stored cookie consent:", storedCookieConsent);
    return typeof storedCookieConsent === "boolean" ? storedCookieConsent : false;
  });

  useEffect(() => {
    const newValue = cookieConsent ? "granted" : "denied";
    window.gtag("consent", "update", {
      analytics_storage: newValue,
    });
    setLocalStorage("cookie_consent", cookieConsent);
    console.log("Cookie consent updated:", cookieConsent);
  }, [cookieConsent]);

  const handleConsent = (consent: boolean) => {
    if (consent) {
      window.gtag("event", "consent_granted", {
        event_category: "cookie_consent",
        event_label: "Zezwolenie na śledzenie cookies",
      });
    } else {
      window.gtag("event", "consent_denied", {
        event_category: "cookie_consent",
        event_label: "Odmowa zgody na śledzenie cookies",
      });
    }
    setCookieConsent(consent);
  };

  return (
    <div
      className={`my-10 mx-auto max-w-max md:max-w-screen-sm
      fixed bottom-0 left-0 right-0 
      ${cookieConsent ? "hidden" : "flex"}
      px-3 md:px-4 py-3 justify-between items-center flex-col sm:flex-row gap-4  
      bg-gray-700 rounded-lg shadow`}
    >
      <div className="text-center">
        <Link href="/info/cookies">
          <p>
            We use <span className="font-bold text-sky-400">cookies</span> on our site.
          </p>
        </Link>
      </div>

      <div className="flex gap-2">
        <button onClick={() => handleConsent(false)} type="button">
          Decline
        </button>
        <button onClick={() => handleConsent(true)} type="button">
          Allow Cookies
        </button>
      </div>
    </div>
  );
}
