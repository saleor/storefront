import { Paths } from "./types";

export const updateCookieConsent = (consent: boolean) => {
  const newValue = consent ? "granted" : "denied";
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: newValue,
    });

    const event = consent ? "consent_granted" : "consent_denied";
    window.gtag("event", event, {
      event_category: "cookie_consent",
      event_label: `Zezwolenie na śledzenie cookies: ${consent}`,
    });
  }
};

export const getStorefrontTermsUrl = (paths: Paths, storefrontName: string) => {
  switch (storefrontName) {
    case "FASHION4YOU":
      return paths.terms_and_conditions_f4u?.$url().toString() ?? "";
    case "CLOTHES4U":
      return paths.terms_and_conditions_c4u?.$url().toString() ?? "";
    default:
      return paths.terms_and_conditions?.$url().toString() ?? "";
  }
};
