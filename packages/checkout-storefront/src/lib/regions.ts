export const regions = {
  "en-US": "United States",
  "pl-PL": "Polska",
  "fr-FR": "France",
};

const DEFAULT_REGION = "en-US";

export const getCurrentRegion = (): keyof typeof regions => DEFAULT_REGION;

export type Region = keyof typeof regions;
