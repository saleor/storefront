import { defaultPublicSettings } from "@/checkout-app/config/defaults";
import {
  PublicMetafieldsValues,
  PublicSettingsValues,
  UnknownPublicSettingsValues,
} from "@/checkout-app/types/api";
import { allPublicSettingID } from "@/checkout-app/types/common";
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

export const mapPublicMetafieldsToSettings = (
  metafields: PublicMetafieldsValues
): PublicSettingsValues => {
  return reduce(
    metafields,
    (settings, metafield, metafieldKey) => {
      const settingsKey = metafieldKey as keyof typeof settings;

      if (!settingsKey || !allPublicSettingID.includes(settingsKey)) {
        return settings;
      }

      try {
        const metadataItemSettings = JSON.parse(metafield || "");

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
    },
    defaultPublicSettings
  );
};
