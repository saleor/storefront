import {
  ChannelDocument,
  ChannelQuery,
  ChannelQueryVariables,
  ChannelsDocument,
  ChannelsQuery,
  ChannelsQueryVariables,
  PrivateMetafieldsDocument,
  PrivateMetafieldsQuery,
  PrivateMetafieldsQueryVariables,
  PublicMetafieldsDocument,
  PublicMetafieldsQuery,
  PublicMetafieldsQueryVariables,
  UpdatePrivateMetadataDocument,
  UpdatePrivateMetadataMutation,
  UpdatePrivateMetadataMutationVariables,
} from "@/checkout-app/graphql";
import { getClient } from "@/checkout-app/backend/client";
import { defaultActiveChannelPaymentProviders } from "@/checkout-app/config/defaults";
import { mergeChannelsWithPaymentProvidersSettings } from "./utils";
import { envVars, serverEnvVars } from "@/checkout-app/constants";
import { PrivateSettingsValues } from "@/checkout-app/types/api";
import { mapPrivateSettingsToMetadata } from "./mapPrivateSettingsToMetadata";
import { mapPrivateMetafieldsToSettings } from "./mapPrivateMetafieldsToSettings";
import { mapPublicMetafieldsToSettings } from "@/checkout-app/frontend/misc/mapPublicMetafieldsToSettings";
import {
  allPrivateSettingID,
  allPublicSettingID,
} from "@/checkout-app/types/common";

export const getPrivateSettings = async (
  apiUrl: string,
  obfuscateEncryptedData: boolean
) => {
  const { data, error } = await getClient(apiUrl, serverEnvVars.appToken)
    .query<PrivateMetafieldsQuery, PrivateMetafieldsQueryVariables>(
      PrivateMetafieldsDocument,
      { id: serverEnvVars.appId, keys: [...allPrivateSettingID] }
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
  const { data, error } = await getClient(
    envVars.apiUrl,
    serverEnvVars.appToken
  )
    .query<PublicMetafieldsQuery, PublicMetafieldsQueryVariables>(
      PublicMetafieldsDocument,
      { id: serverEnvVars.appId, keys: [...allPublicSettingID] }
    )
    .toPromise();

  console.log(data, error); // for deployment debug pusposes

  if (error) {
    throw error;
  }

  console.log(data?.app?.metafields); // for deployment debug pusposes

  const settingsValues = mapPublicMetafieldsToSettings(
    data?.app?.metafields || {}
  );

  return settingsValues;
};

export const getActivePaymentProvidersSettings = async () => {
  const settings = await getPublicSettings();

  const { data, error } = await getClient(
    envVars.apiUrl,
    serverEnvVars.appToken
  )
    .query<ChannelsQuery, ChannelsQueryVariables>(ChannelsDocument)
    .toPromise();

  console.log(data, error); // for deployment debug pusposes

  if (error) {
    throw error;
  }

  const activePaymentProvidersSettings =
    mergeChannelsWithPaymentProvidersSettings(settings, data?.channels);

  return activePaymentProvidersSettings;
};

export const getChannelActivePaymentProvidersSettings = async (
  channelId: string
) => {
  const settings = await getPublicSettings();

  const { data, error } = await getClient(
    envVars.apiUrl,
    serverEnvVars.appToken
  )
    .query<ChannelQuery, ChannelQueryVariables>(ChannelDocument, {
      id: channelId,
    })
    .toPromise();

  console.log(data, error); // for deployment debug pusposes

  if (error) {
    throw error;
  }

  const channelActivePaymentProvidersSettings =
    settings.channelActivePaymentProviders?.[channelId] ||
    defaultActiveChannelPaymentProviders;

  return channelActivePaymentProvidersSettings;
};

export const setPrivateSettings = async (
  apiUrl: string,
  settings: PrivateSettingsValues<"unencrypted">
) => {
  const metadata = mapPrivateSettingsToMetadata(settings);

  const { data, error } = await getClient(apiUrl, serverEnvVars.appToken)
    .mutation<
      UpdatePrivateMetadataMutation,
      UpdatePrivateMetadataMutationVariables
    >(UpdatePrivateMetadataDocument, {
      id: serverEnvVars.appId!,
      input: metadata,
      keys: [...allPrivateSettingID],
    })
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
