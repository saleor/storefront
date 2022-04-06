import { SettingsValues, UnknownSettingsValues } from "types/api";
import { allSettingID, Item, NamedNode, Node, SettingID } from "types/common";

export function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    Buffer.from(base64, "base64")
      .toString()
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export const flattenSettingId = (optionIdx: number, settingId: string) =>
  `${optionIdx}-${settingId}`;

export const unflattenSettings = <T, S extends Node>(
  flattenedSettings: Record<string, T>,
  options: S[]
) => {
  const unflattenedSettings: UnknownSettingsValues<T> = {};

  Object.keys(flattenedSettings).forEach((flattedKey) => {
    const keys = flattedKey.split(/-(.+)/);

    const mainKey = options[Number(keys[0])]?.id;
    const subKey = keys[1];

    if (mainKey && subKey) {
      unflattenedSettings[mainKey] = {
        ...unflattenedSettings[mainKey],
        [subKey]: flattenedSettings[flattedKey],
      };
    }
  });

  return unflattenedSettings;
};

export const mapMetadataToSettings = (
  metadata: Array<{
    __typename?: "MetadataItem";
    key: string;
    value: string;
  } | null>
): Partial<SettingsValues> => {
  const settings = metadata.reduce((settings, metadataItem) => {
    const settingsKey = metadataItem?.key;

    if (
      !settingsKey ||
      !allSettingID.includes(settingsKey as SettingID[number])
    ) {
      return settings;
    }

    try {
      const settingsValue = JSON.parse(metadataItem?.value);
      return {
        ...settings,
        [settingsKey]: settingsValue,
      };
    } catch (e) {
      return {
        ...settings,
        [settingsKey]: {},
      };
    }
  }, {} as SettingsValues);

  return settings;
};

export const mapSettingsToMetadata = (
  settingsValues: Partial<SettingsValues>
) => {
  return Object.keys(settingsValues).reduce(
    (metadata, settingsValuesKey) => {
      const settingsValuesObject =
        settingsValues[settingsValuesKey as keyof SettingsValues];
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

export const mapNodeToItem = (node: NamedNode): Item => ({
  id: node.id,
  label: node.name,
});
export const mapNodesToItems = (nodes?: NamedNode[]): Item[] =>
  nodes?.map(mapNodeToItem) || [];
