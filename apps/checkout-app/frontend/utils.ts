import { UnknownSettingsValues } from "types/api";
import { Node } from "types/common";

export const flattenSettingId = (optionIdx: number, settingId: string) =>
  `${optionIdx}-${settingId}`;

export const unflattenSettings = <T extends Node>(
  flattedSettings: Record<string, string>,
  options: T[]
) => {
  const unflattedSettings: UnknownSettingsValues = {};

  Object.keys(flattedSettings).forEach((flattedKey) => {
    const keys = flattedKey.split(/-(.+)/);

    const mainKey = options[keys[0]]?.id;
    const subKey = keys[1];

    if (mainKey && subKey) {
      unflattedSettings[mainKey] = {
        ...unflattedSettings[mainKey],
        [subKey]: flattedSettings[flattedKey],
      };
    }
  });

  return unflattedSettings;
};
