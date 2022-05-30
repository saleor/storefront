import { defaultPrivateSettings } from "@/config/defaults";
import {
  PrivateMetafieldsValues,
  PrivateSettingsValues,
  SettingValue,
  UnknownPrivateSettingsValues,
} from "@/types/api";
import { allSettingID } from "@/types/common";
import reduce from "lodash-es/reduce";
import { decryptSetting } from "./encryption";

const readSettingsValues = (
  subSettings: Record<string, SettingValue | string | undefined>
) => {
  return reduce(
    subSettings,
    (subSettings, subSetting, subSettingKey) => {
      const isSettingValue =
        typeof subSetting !== "string" &&
        subSetting &&
        "value" in subSetting &&
        "encrypted" in subSetting;

      if (!isSettingValue && subSetting) {
        return {
          ...subSettings,
          [subSettingKey]: subSetting,
        };
      }

      if (!isSettingValue) {
        return subSettings;
      }

      return {
        ...subSettings,
        [subSettingKey]: subSetting.encrypted
          ? decryptSetting(subSetting as SettingValue)
          : subSetting.value,
      };
    },
    {} as Record<string, string>
  );
};

/**
 * Merges settings. To be used when default and saved settings may differ (e.g. after app update).
 * @param defaultSettings default settings
 * @param savedSettings saved settings
 * @returns Returns either previously saved settings values or default settings values. If settings values are present in default and saved at the same time, then saved value is returned.
 */
export const mergeSettingsValues = (
  defaultSettings: UnknownPrivateSettingsValues<"unencrypted">,
  savedSettings: UnknownPrivateSettingsValues<"encrypted">
) => {
  return reduce(
    defaultSettings,
    (result, defaultSetting, settingKey) => {
      const savedSetting = savedSettings[settingKey];
      const hasSettingInBothSettings = !!savedSetting;
      const udpatedSetting = hasSettingInBothSettings
        ? { ...defaultSetting, ...savedSetting }
        : defaultSetting;
      const setting = readSettingsValues(udpatedSetting);

      return {
        ...result,
        [settingKey]: setting,
      };
    },
    {} as UnknownPrivateSettingsValues<"unencrypted">
  );
};

export const mapPrivateMetafieldsToSettings = (
  metafields: PrivateMetafieldsValues
): PrivateSettingsValues<"unencrypted"> => {
  return reduce(
    metafields,
    (settings, metafield, metafieldKey) => {
      const settingsKey = metafieldKey as keyof typeof settings;

      if (!settingsKey || !allSettingID.includes(settingsKey)) {
        return settings;
      }

      try {
        const metadataItemSettings = JSON.parse(metafield || "");

        return {
          ...settings,
          [settingsKey]: mergeSettingsValues(
            settings[settingsKey],
            metadataItemSettings
          ) as PrivateSettingsValues<"unencrypted">[keyof PrivateSettingsValues<"unencrypted">],
        };
      } catch (e) {
        return {
          ...settings,
          [settingsKey]: settings[settingsKey] || {},
        };
      }
    },
    defaultPrivateSettings
  );
};
