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
import { getClientForAuthData } from "@/saleor-app-checkout/backend/saleorGraphqlClient";
import { defaultActiveChannelPaymentProviders } from "@/saleor-app-checkout/config/defaults";
import { mergeChannelsWithPaymentProvidersSettings } from "./utils";
import { PrivateSettingsValues } from "@/saleor-app-checkout/types/api";
import { mapPrivateSettingsToMetadata } from "./mapPrivateSettingsToMetadata";
import { mapPrivateMetafieldsToSettings } from "./mapPrivateMetafieldsToSettings";
import { mapPublicMetafieldsToSettings } from "@/saleor-app-checkout/frontend/misc/mapPublicMetafieldsToSettings";
import { allPrivateSettingID, allPublicSettingID } from "@/saleor-app-checkout/types/common";
import { getAppId } from "../environment";
import * as Apl from "@/saleor-app-checkout/config/apl";

export const getPrivateSettings = async ({
  saleorApiHost,
  obfuscateEncryptedData,
}: {
  saleorApiHost: string;
  obfuscateEncryptedData: boolean;
}) => {
  const authData = await Apl.get(saleorApiHost);
  const client = getClientForAuthData(authData);

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

export const getPublicSettings = async ({ saleorApiHost }: { saleorApiHost: string }) => {
  const authData = await Apl.get(saleorApiHost);

  const { data, error } = await getClientForAuthData(authData)
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

export const getActivePaymentProvidersSettings = async (saleorApiHost: string) => {
  const authData = await Apl.get(saleorApiHost);
  const settings = await getPublicSettings({ saleorApiHost });

  const { data, error } = await getClientForAuthData(authData)
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

export const getChannelActivePaymentProvidersSettings = async ({
  saleorApiHost,
  channelId,
}: {
  saleorApiHost: string;
  channelId: string;
}) => {
  const authData = await Apl.get(saleorApiHost);
  const settings = await getPublicSettings({ saleorApiHost });

  const { data, error } = await getClientForAuthData(authData)
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
  saleorApiHost: string,
  settings: PrivateSettingsValues<"unencrypted">
) => {
  const authData = await Apl.get(saleorApiHost);
  const client = getClientForAuthData(authData);

  const metadata = mapPrivateSettingsToMetadata(settings);

  const appId = await getAppId(saleorApiHost);

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
