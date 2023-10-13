export const locales = ["en-US", "pl-PL"] as const;

export const DEFAULT_LOCALE = "pl-PL";

export const DEFAULT_CHANNEL = "default-channel";

export type Locale = typeof locales[number];
