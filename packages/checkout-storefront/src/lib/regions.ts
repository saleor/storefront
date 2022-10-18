export const locales = ["en-US", "minion", "pl-PL", "fr-FR", "nl-NL"] as const;

export const DEFAULT_LOCALE = "en-US";

export type Locale = typeof locales[number];
