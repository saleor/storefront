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
} from "@/checkout-app/graphql";
import { getClient } from "@/checkout-app/backend/client";
import { defaultActiveChannelPaymentProviders } from "@/checkout-app/config/defaults";
import { mergeChannelsWithPaymentProvidersSettings } from "./utils";
import { PrivateSettingsValues } from "@/checkout-app/types/api";
import { mapPrivateSettingsToMetadata } from "./mapPrivateSettingsToMetadata";
import { mapPrivateMetafieldsToSettings } from "./mapPrivateMetafieldsToSettings";
import { mapPublicMetafieldsToSettings } from "@/checkout-app/frontend/misc/mapPublicMetafieldsToSettings";
import {
  allPrivateSettingID,
  allPublicSettingID,
} from "@/checkout-app/types/common";
import { getAppId } from "../environment";

export const getPrivateSettings = async (
  apiUrl: string,
  obfuscateEncryptedData: boolean
) => {
  const { data, error } = await getClient({ apiUrl })
    .query<
      PrivateMetafieldsInferedQuery,
      PrivateMetafieldsInferedQueryVariables
    >(PrivateMetafieldsInferedDocument, {
      keys: [...allPrivateSettingID],
    })
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

  const settingsValues = mapPublicMetafieldsToSettings(
    data?.app?.metafields || {}
  );

  return settingsValues;
};

export const getActivePaymentProvidersSettings = async () => {
  const settings = await getPublicSettings();

  const { data, error } = await getClient()
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
    settings.channelActivePaymentProviders?.[channelId] ||
    defaultActiveChannelPaymentProviders;

  return channelActivePaymentProvidersSettings;
};

export const setPrivateSettings = async (
  apiUrl: string,
  settings: PrivateSettingsValues<"unencrypted">
) => {
  const metadata = mapPrivateSettingsToMetadata(settings);

  const appId = await getAppId();

  const { data, error } = await getClient({ apiUrl })
    .mutation<
      UpdatePrivateMetadataMutation,
      UpdatePrivateMetadataMutationVariables
    >(UpdatePrivateMetadataDocument, {
      id: appId,
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
