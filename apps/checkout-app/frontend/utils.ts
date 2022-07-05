import {
  PublicMetafieldsValues,
  UnknownPublicSettingsValues,
} from "@/checkout-app/types/api";
import {
  Item,
  NamedNode,
  Node,
  PublicMetafieldID,
  PublicSettingID,
} from "@/checkout-app/types/common";
import { CombinedError } from "urql";

export const flattenSettingId = (
  groupId: PublicSettingID[number],
  optionIdx: number,
  settingId: string
) => `${groupId}-${optionIdx}-${settingId}`;

export const unflattenValue = (
  valueId: PublicMetafieldID[number],
  flattenedValues: Record<string, string>
) => {
  const valueKey = Object.keys(flattenedValues).find((flattedKey) => {
    const keys = flattedKey.split("-");

    return keys[0] === valueId;
  });

  return valueKey && flattenedValues[valueKey];
};

export const unflattenSettings = <S extends Node>(
  groupId: PublicSettingID[number],
  flattenedValues: Record<string, string>,
  options: S[]
) => {
  const unflattenedSettings: UnknownPublicSettingsValues = {};

  Object.keys(flattenedValues).forEach((flattedKey) => {
    const keys = flattedKey.split("-");

    if (keys[0] !== groupId) {
      return;
    }

    const mainKey = options[Number(keys[1])]?.id;
    const subKey = keys[2];

    if (mainKey && subKey) {
      unflattenedSettings[mainKey] = {
        ...unflattenedSettings[mainKey],
        [subKey]: flattenedValues[flattedKey],
      };
    }
  });

  return unflattenedSettings;
};

export const mapNodeToItem = (node: NamedNode): Item => ({
  id: node.id,
  label: node.name,
});
export const mapNodesToItems = (nodes?: NamedNode[]): Item[] =>
  nodes?.map(mapNodeToItem) || [];

export const getCommonErrors = (error?: Partial<CombinedError>) =>
  error?.graphQLErrors || error?.networkError
    ? [
        ...(error?.graphQLErrors || []),
        ...(error?.networkError ? [error.networkError] : []),
      ]
    : [...(error ? [error] : [])];

export const getMetafield = (
  metafields: PublicMetafieldsValues,
  metafieldId: PublicMetafieldID[number]
) => metafields[metafieldId];

export const getRawAppPath = (path: string): string => {
  const trimmedQueryParams = path.split("?")[0];

  const trimmedLanguage = trimmedQueryParams.replace(
    /^\/[a-z]{2}(-[A-Z]{2})?(\/|$)/,
    "/"
  );

  return trimmedLanguage;
};
