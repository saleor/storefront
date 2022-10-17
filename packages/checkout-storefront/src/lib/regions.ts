import { getQueryVariables } from "@/checkout-storefront/lib/utils";

export const locales = ["en-US", "pl-PL", "fr-FR"] as const;

export const DEFAULT_LOCALE = "en-US";

export const getCurrentLocale = (): Locale => getQueryVariables().locale;

export type Locale = typeof locales[number];
