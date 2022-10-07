export const regions = {
  "en-US": "United States",
  "pl-PL": "Polska",
  "fr-FR": "France",
};

export const DEFAULT_LOCALE = "en-US";

export const getCurrentLocale = (): keyof typeof regions => DEFAULT_LOCALE;

export type Region = keyof typeof regions;
