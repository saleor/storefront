import { defaultPublicSettings } from "@/config/defaults";
import { MetadataItemFragment } from "@/graphql";
import { PublicSettingsValues, UnknownPublicSettingsValues } from "@/types/api";
import { allSettingID } from "@/types/common";
import reduce from "lodash-es/reduce";

/**
 * Merges settings. To be used when default and saved settings may differ (e.g. after app update).
 * @param defaultSettings default settings
 * @param savedSettings saved settings
 * @returns Returns either previously saved settings values or default settings values. If settings values are present in default and saved at the same time, then saved value is returned.
 */
export const mergeSettingsValues = (
  defaultSettings: UnknownPublicSettingsValues,
  savedSettings: UnknownPublicSettingsValues
) => {
  return reduce(
    defaultSettings,
    (result, defaultSetting, settingKey) => {
      const savedSetting = savedSettings[settingKey];
      const hasSettingInBothSettings = !!savedSetting;
      const udpatedSetting = hasSettingInBothSettings
        ? { ...defaultSetting, ...savedSetting }
        : defaultSetting;

      return {
        ...result,
        [settingKey]: udpatedSetting,
      };
    },
    savedSettings
  );
};

export const mapPublicMetadataToSettings = (
  metadata: (MetadataItemFragment | null)[]
): PublicSettingsValues => {
  const settings = metadata.reduce((settings, metadataItem) => {
    const settingsKey = metadataItem?.key as keyof typeof settings;

    if (!settingsKey || !allSettingID.includes(settingsKey)) {
      return settings;
    }

    try {
      const metadataItemSettings = JSON.parse(metadataItem?.value || "");

      return {
        ...settings,
        [settingsKey]: mergeSettingsValues(
          settings[settingsKey],
          metadataItemSettings
        ),
      };
    } catch (e) {
      return {
        ...settings,
        [settingsKey]: settings[settingsKey] || {},
      };
    }
  }, defaultPublicSettings);

  return settings as PublicSettingsValues;
};
