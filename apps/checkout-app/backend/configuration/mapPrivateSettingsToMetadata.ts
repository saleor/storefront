import { CommonField, fields } from "@/checkout-app/config/fields";
import { PrivateSettingsValues, SettingValue } from "@/checkout-app/types/api";
import { PrivateSettingID } from "@/checkout-app/types/common";
import reduce from "lodash-es/reduce";
import { encryptSetting } from "./encryption";

const encryptSubSettings = (
  subSetting: Record<string, string> | undefined,
  subSettingsFields?: CommonField[]
) => {
  const encryptedSubSetting = reduce(
    subSetting,
    (result, value, valueKey) => {
      const setting = subSettingsFields?.find(
        (setting) => setting.id === valueKey
      );

      if (setting?.encrypt && value) {
        return {
          ...result,
          [valueKey]: encryptSetting(value),
        };
      }
      return {
        ...result,
        [valueKey]: {
          encrypted: false,
          value,
        },
      };
    },
    {} as Record<string, SettingValue>
  );

  return encryptedSubSetting;
};

const encryptSettings = (
  settingsValues: Partial<Record<string, Record<string, string>>> | undefined,
  settingsFields: Record<string, CommonField[]>
) => {
  const encrypteSettings = reduce(
    settingsValues,
    (result, subSetting, settingKey) => {
      const subSettingsFields = settingsFields[settingKey];

      const encryptedSubSetting = encryptSubSettings(
        subSetting,
        subSettingsFields
      );

      return {
        ...result,
        [settingKey]: encryptedSubSetting,
      };
    },
    {} as Partial<
      PrivateSettingsValues<"encrypted">[keyof PrivateSettingsValues<"unencrypted">]
    >
  );
  return encrypteSettings;
};

export const mapPrivateSettingsToMetadata = (
  settingsValues: Partial<PrivateSettingsValues<"unencrypted">>
) => {
  return Object.keys(settingsValues).reduce(
    (metadata, settingsValuesKey) => {
      const settingsValuesObject = encryptSettings(
        settingsValues[
          settingsValuesKey as keyof PrivateSettingsValues<"unencrypted">
        ],
        fields[settingsValuesKey as PrivateSettingID[number]]
      );
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
