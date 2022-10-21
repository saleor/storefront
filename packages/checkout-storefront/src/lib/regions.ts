export const locales = ["en-US", "pl-PL"] as const;

export const DEFAULT_LOCALE = "en-US";

export type Locale = typeof locales[number];
