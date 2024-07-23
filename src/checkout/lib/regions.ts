export const locales = ["en-US"] as const;

export const DEFAULT_LOCALE = "en-US";

export type Locale = (typeof locales)[number];
