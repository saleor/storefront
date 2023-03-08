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
import * as Apl from "@/saleor-app-checkout/config/apl";

export const getPrivateSettings = async ({
  saleorApiUrl,
  obfuscateEncryptedData,
}: {
  saleorApiUrl: string;
  obfuscateEncryptedData: boolean;
}) => {
  const authData = await Apl.get(saleorApiUrl);
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

export const getPublicSettings = async ({ saleorApiUrl }: { saleorApiUrl: string }) => {
  const authData = await Apl.get(saleorApiUrl);

  const { data, error } = await getClientForAuthData(authData)
    .query<PublicMetafieldsInferedQuery, PublicMetafieldsInferedQueryVariables>(
      PublicMetafieldsInferedDocument,
      { keys: [...allPublicSettingID] }
    )
    .toPromise();

  console.log("getPublicSettings request result:", data, error);

  if (error) {
    throw error;
  }

  const settingsValues = mapPublicMetafieldsToSettings(data?.app?.metafields || {});

  return settingsValues;
};

export const getActivePaymentProvidersSettings = async (saleorApiUrl: string) => {
  const authData = await Apl.get(saleorApiUrl);
  const settings = await getPublicSettings({ saleorApiUrl });

  const { data, error } = await getClientForAuthData(authData)
    .query<ChannelsQuery, ChannelsQueryVariables>(ChannelsDocument, {})
    .toPromise();

  console.log("getActivePaymentProvidersSettings request result", data, error);

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
  saleorApiUrl,
  channelId,
}: {
  saleorApiUrl: string;
  channelId: string;
}) => {
  const authData = await Apl.get(saleorApiUrl);
  const settings = await getPublicSettings({ saleorApiUrl });

  const { data, error } = await getClientForAuthData(authData)
    .query<ChannelQuery, ChannelQueryVariables>(ChannelDocument, {
      id: channelId,
    })
    .toPromise();

  console.log("getChannelActivePaymentProvidersSettings request result:", data, error);

  if (error) {
    throw error;
  }

  const channelActivePaymentProvidersSettings =
    settings.channelActivePaymentProviders?.[channelId] || defaultActiveChannelPaymentProviders;

  return channelActivePaymentProvidersSettings;
};

export const setPrivateSettings = async (
  saleorApiUrl: string,
  settings: PrivateSettingsValues<"unencrypted">
) => {
  const authData = await Apl.get(saleorApiUrl);
  const client = getClientForAuthData(authData);

  const metadata = mapPrivateSettingsToMetadata(settings);

  const { data, error } = await client
    .mutation<UpdatePrivateMetadataMutation, UpdatePrivateMetadataMutationVariables>(
      UpdatePrivateMetadataDocument,
      {
        id: authData.appId,
        input: metadata,
        keys: [...allPrivateSettingID],
      }
    )
    .toPromise();

  console.log("setPrivateSettings request result", data, error);

  if (error) {
    throw error;
  }

  const settingsValues = mapPrivateMetafieldsToSettings(
    data?.updatePrivateMetadata?.item?.privateMetafields || {},
    true
  );

  return settingsValues;
};
