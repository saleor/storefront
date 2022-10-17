import { getQueryParams } from "@/checkout-storefront/lib/utils";

export const locales = ["en-US", "pl-PL", "fr-FR", "nl-NL"] as const;

export const DEFAULT_LOCALE = "en-US";

export const getCurrentLocale = (): Locale => getQueryParams().locale;

export type Locale = typeof locales[number];
