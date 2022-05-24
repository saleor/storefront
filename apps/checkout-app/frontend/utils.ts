import { UnknownPublicSettingsValues } from "@/types/api";
import {
  Item,
  NamedNode,
  Node,
  PaymentProvider,
  PaymentProviderID,
} from "@/types/common";
import { CombinedError } from "urql";

export const flattenSettingId = (optionIdx: number, settingId: string) =>
  `${optionIdx}-${settingId}`;

export const unflattenSettings = <S extends Node>(
  flattenedSettings: Record<string, string>,
  options: S[]
) => {
  const unflattenedSettings: UnknownPublicSettingsValues = {};

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
