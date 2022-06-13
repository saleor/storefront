import {
  PublicMetafieldsValues,
  PublicSettingsValues,
} from "@/checkout-app/types/api";

export const mapPublicSettingsToMetadata = (
  settingsValues: Partial<PublicSettingsValues>
) => {
  return Object.keys(settingsValues).reduce(
    (metadata, settingsValuesKey) => {
      const settingsValuesObject =
        settingsValues[settingsValuesKey as keyof PublicSettingsValues];
      const settingsValuesValue = JSON.stringify(settingsValuesObject);

      return [
        ...metadata,
        {
          key: settingsValuesKey,
          value: settingsValuesValue,
        },
      ];
    },
    [] as Array<{
      key: string;
      value: string;
    }>
  );
};

export const mapPublicMetafieldsToMetadata = (
  metafieldsValues: Partial<PublicMetafieldsValues>
) => {
  return Object.keys(metafieldsValues).reduce(
    (metadata, metafieldsValuesKey) => {
      const metafieldsValuesValue =
        metafieldsValues[metafieldsValuesKey as keyof PublicMetafieldsValues];

      return [
        ...metadata,
        {
          key: metafieldsValuesKey,
          value: metafieldsValuesValue || "",
        },
      ];
    },
    [] as Array<{
      key: string;
      value: string;
    }>
  );
};
