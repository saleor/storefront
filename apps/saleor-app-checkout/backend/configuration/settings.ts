import {
  ChannelDocument,
  ChannelQuery,
  ChannelQueryVariables,
  ChannelsDocument,
  ChannelsQuery,
  ChannelsQueryVariables,
  PrivateMetafieldsInferedDocument,
  PrivateMetafieldsInferedQuery,
  PrivateMetafieldsInferedQueryVariables,
  PublicMetafieldsInferedDocument,
  PublicMetafieldsInferedQuery,
  PublicMetafieldsInferedQueryVariables,
  UpdatePrivateMetadataDocument,
  UpdatePrivateMetadataMutation,
  UpdatePrivateMetadataMutationVariables,
} from "@/saleor-app-checkout/graphql";
import { getClient } from "@/saleor-app-checkout/backend/client";
import { defaultActiveChannelPaymentProviders } from "@/saleor-app-checkout/config/defaults";
import { mergeChannelsWithPaymentProvidersSettings } from "./utils";
import { PrivateSettingsValues } from "@/saleor-app-checkout/types/api";
import { mapPrivateSettingsToMetadata } from "./mapPrivateSettingsToMetadata";
import { mapPrivateMetafieldsToSettings } from "./mapPrivateMetafieldsToSettings";
import { mapPublicMetafieldsToSettings } from "@/saleor-app-checkout/frontend/misc/mapPublicMetafieldsToSettings";
import { allPrivateSettingID, allPublicSettingID } from "@/saleor-app-checkout/types/common";
import { getAppId } from "../environment";

export const getPrivateSettings = async (apiUrl: string, obfuscateEncryptedData: boolean) => {
  const { data, error } = await getClient({ apiUrl })
    .query<PrivateMetafieldsInferedQuery, PrivateMetafieldsInferedQueryVariables>(
      PrivateMetafieldsInferedDocument,
      {
        keys: [...allPrivateSettingID],
      }
    )
    .toPromise();

  if (error) {
    throw error;
  }

  const settingsValues = mapPrivateMetafieldsToSettings(
    data?.app?.privateMetafields || {},
    obfuscateEncryptedData
  );

  return settingsValues;
};

export const getPublicSettings = async () => {
  const { data, error } = await getClient()
    .query<PublicMetafieldsInferedQuery, PublicMetafieldsInferedQueryVariables>(
      PublicMetafieldsInferedDocument,
      { keys: [...allPublicSettingID] }
    )
    .toPromise();

  console.log(data, error); // for deployment debug pusposes

  if (error) {
    throw error;
  }

  console.log(data?.app?.metafields); // for deployment debug pusposes

  const settingsValues = mapPublicMetafieldsToSettings(data?.app?.metafields || {});

  return settingsValues;
};

export const getActivePaymentProvidersSettings = async () => {
  const settings = await getPublicSettings();

  const { data, error } = await getClient()
    .query<ChannelsQuery, ChannelsQueryVariables>(ChannelsDocument, {})
    .toPromise();

  console.log(data, error); // for deployment debug purposes

  if (error) {
    throw error;
  }

  const activePaymentProvidersSettings = mergeChannelsWithPaymentProvidersSettings(
    settings,
    data?.channels
  );

  return activePaymentProvidersSettings;
};

export const getChannelActivePaymentProvidersSettings = async (channelId: string) => {
  const settings = await getPublicSettings();

  const { data, error } = await getClient()
    .query<ChannelQuery, ChannelQueryVariables>(ChannelDocument, {
      id: channelId,
    })
    .toPromise();

  console.log(data, error); // for deployment debug pusposes

  if (error) {
    throw error;
  }

  const channelActivePaymentProvidersSettings =
    settings.channelActivePaymentProviders?.[channelId] || defaultActiveChannelPaymentProviders;

  return channelActivePaymentProvidersSettings;
};

export const setPrivateSettings = async (
  apiUrl: string,
  settings: PrivateSettingsValues<"unencrypted">
) => {
  const metadata = mapPrivateSettingsToMetadata(settings);

  const appId = await getAppId();

  const { data, error } = await getClient({ apiUrl })
    .mutation<UpdatePrivateMetadataMutation, UpdatePrivateMetadataMutationVariables>(
      UpdatePrivateMetadataDocument,
      {
        id: appId,
        input: metadata,
        keys: [...allPrivateSettingID],
      }
    )
    .toPromise();

  console.log(data, error); // for deployment debug pusposes

  if (error) {
    throw error;
  }

  console.log(data?.updatePrivateMetadata?.item?.privateMetafields); // for deployment debug pusposes

  const settingsValues = mapPrivateMetafieldsToSettings(
    data?.updatePrivateMetadata?.item?.privateMetafields || {},
    true
  );

  return settingsValues;
};
