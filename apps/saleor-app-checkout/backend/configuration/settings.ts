import {
  AppDocument,
  AppQuery,
  AppQueryVariables,
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
import { apl } from "@/saleor-app-checkout/config/saleorApp";

export const getPrivateSettings = async (apiUrl: string, obfuscateEncryptedData: boolean) => {
  const authData = await apl.get(new URL(apiUrl).hostname);
  if (!authData) {
    throw new Error("Unknown domain");
  }
  const client = getClient({ appToken: authData.token, apiUrl });

  const { data, error } = await client
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

export const getPublicSettings = async (domain: string) => {
  const authData = await apl.get(domain);
  if (!authData) {
    throw new Error("Unknown domain");
  }
  const client = await getClient({
    appToken: authData.token,
    apiUrl: `https://${authData.domain}/graphql/`,
  });

  const { data, error } = await client
    .query<PublicMetafieldsInferedQuery, PublicMetafieldsInferedQueryVariables>(
      PublicMetafieldsInferedDocument,
      { keys: [...allPublicSettingID] }
    )
    .toPromise();

  if (error) {
    throw error;
  }

  const settingsValues = mapPublicMetafieldsToSettings(data?.app?.metafields || {});

  return settingsValues;
};

export const getActivePaymentProvidersSettings = async (domain: string) => {
  const settings = await getPublicSettings(domain);
  const authData = await apl.get(domain);
  if (!authData) {
    throw new Error("");
  }
  const client = await getClient({
    appToken: authData.token,
    apiUrl: `https://${domain}/graphql/`,
  });
  const { data, error } = await client
    .query<ChannelsQuery, ChannelsQueryVariables>(ChannelsDocument)
    .toPromise();

  if (error) {
    throw error;
  }

  const activePaymentProvidersSettings = mergeChannelsWithPaymentProvidersSettings(
    settings,
    data?.channels
  );

  return activePaymentProvidersSettings;
};

export const getChannelActivePaymentProvidersSettings = async (
  channelId: string,
  domain: string
) => {
  const settings = await getPublicSettings(domain);
  const authData = await apl.get(domain);
  if (!authData) {
    throw new Error("Unknown domain");
  }
  const client = await getClient({
    appToken: authData.token,
    apiUrl: `https://${authData.domain}/graphql/`,
  });

  const { data, error } = await client
    .query<ChannelQuery, ChannelQueryVariables>(ChannelDocument, {
      id: channelId,
    })
    .toPromise();

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
  const authData = await apl.get(new URL(apiUrl).hostname);
  if (!authData) {
    throw new Error("Unknown domain");
  }
  const client = await getClient({
    appToken: authData.token,
    apiUrl: `https://${authData.domain}/graphql/`,
  });

  const { data: idData, error: idError } = await client
    .query<AppQuery, AppQueryVariables>(AppDocument)
    .toPromise();
  if (idError) {
    throw new Error("Couldn't fetch app id", { cause: idError });
  }
  const appId = idData?.app?.id;

  if (!appId) {
    throw new Error("Could not get the app ID");
  }

  const { data, error } = await client
    .mutation<UpdatePrivateMetadataMutation, UpdatePrivateMetadataMutationVariables>(
      UpdatePrivateMetadataDocument,
      {
        id: appId,
        input: metadata,
        keys: [...allPrivateSettingID],
      }
    )
    .toPromise();

  if (error) {
    throw error;
  }

  const settingsValues = mapPrivateMetafieldsToSettings(
    data?.updatePrivateMetadata?.item?.privateMetafields || {},
    true
  );

  return settingsValues;
};
