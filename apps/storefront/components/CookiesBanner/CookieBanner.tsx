"use client";

import Link from "next/link";
import { useEffect } from "react";
import { STOREFRONT_NAME } from "@/lib/const";
import usePaths from "@/lib/paths";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { ConsentStatus } from "./types";
import { getStorefrontTermsUrl, updateCookieConsent } from "./utils";

export default function CookieBanner() {
  const paths = usePaths();
  const [cookieConsent, setCookieConsent] = useLocalStorage<ConsentStatus>("cookie_consent", null);

  useEffect(() => {
    if (cookieConsent !== null) {
      updateCookieConsent(cookieConsent);
    }
  }, [cookieConsent]);

  const handleConsent = (consent: boolean): void => {
    setCookieConsent(consent);
  };

  const storefrontTerms = getStorefrontTermsUrl(paths, STOREFRONT_NAME ?? "");

  return (
    <div
      className={`w-screen fixed block bottom-0 left-0 right-0 
          ${cookieConsent !== null ? "hidden" : "flex"} 
          px-3 md:px-4 py-4 justify-between items-center flex-col sm:flex-row gap-4  
          bg-black shadow-lg text-white z-50`}
    >
      <div className="mx-16 text-left max-w-[640px] text-sm">
        <Link href={storefrontTerms}>
          Nasz sklep {STOREFRONT_NAME}, używa plików{" "}
          <span className="font-bold text-brand">cookies</span>. Są one używane przez nas i naszych
          zaufanych partnerów do zapewnienia prawidłowego funkcjonowania strony, personalizacji
          treści i reklam oraz analizy ruchu na stronie.
        </Link>
      </div>

      <div className="mx-16 flex gap-2">
        <button
          onClick={() => handleConsent(false)}
          type="button"
          className="bg-white text-black text-sm py-1 px-3 border-2 border-white hover:bg-transparent hover:text-white transition duration-200 hover:border-2 hover:border-white"
        >
          Odrzuć
        </button>
        <button
          onClick={() => handleConsent(true)}
          type="button"
          className="bg-white text-black text-sm py-1 px-3 border-2 border-white hover:bg-transparent hover:text-white transition duration-200 hover:border-2 hover:border-white"
        >
          Zezwól na cookies
        </button>
      </div>
    </div>
  );
}
