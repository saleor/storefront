export const regions = {
  "en-US": "United States",
  "pl-PL": "Polska",
};

const DEFAULT_REGION = "en-US";

export const getCurrentRegion = (): keyof typeof regions => DEFAULT_REGION;

export type Region = keyof typeof regions;
