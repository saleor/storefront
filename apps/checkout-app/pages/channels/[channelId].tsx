import { serverEnvVars } from "@/constants";
import ErrorDetails from "@/frontend/components/templates/ErrorDetails";
import { useChannelPaymentOptions } from "@/frontend/data";
import { useAuthData } from "@/frontend/hooks/useAuthData";
import { notFoundMessages } from "@/frontend/misc/errorMessages";
import { mapPublicMetafieldsToSettings } from "@/frontend/misc/mapPublicMetafieldsToSettings";
import { mapPublicSettingsToMetadata } from "@/frontend/misc/mapPublicSettingsToMetadata";
import { getCommonErrors } from "@/frontend/utils";
import {
  useChannelsQuery,
  usePublicMetafieldsQuery,
  useUpdatePublicMetadataMutation,
} from "@/graphql";
import { PublicSettingID } from "@/types/common";
import ChannelDetails from "frontend/components/templates/ChannelDetails";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { ChannelActivePaymentProviders } from "types/api";

const Channel = () => {
  const router = useRouter();
  const { channelId } = router.query;
  const intl = useIntl();

  const { appId, isAuthorized } = useAuthData();
  const [metafieldsQuery] = usePublicMetafieldsQuery({
    variables: {
      id: appId || serverEnvVars.appId,
      keys: ["channelActivePaymentProviders"] as PublicSettingID[number][],
    },
    pause: !isAuthorized,
  });
  const [metadataMutation, setPublicMetadata] =
    useUpdatePublicMetadataMutation();

  const settingsValues = mapPublicMetafieldsToSettings(
    metafieldsQuery.data?.app?.metafields || {}
  );

  const [channelsQuery] = useChannelsQuery({
    pause: !isAuthorized,
  });
  const channels = channelsQuery.data?.channels || [];

  const channelPaymentOptions = useChannelPaymentOptions(
    channels,
    settingsValues.channelActivePaymentProviders,
    channelId?.toString()
  );

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = (data: ChannelActivePaymentProviders) => {
    const metadata = mapPublicSettingsToMetadata({
      channelActivePaymentProviders: {
        ...settingsValues.channelActivePaymentProviders,
        ...data,
      },
    });

    setPublicMetadata({
      id: appId || serverEnvVars.appId,
      input: metadata,
    });
  };

  const errors = [
    ...(metadataMutation.data?.updateMetadata?.errors || []),
    ...getCommonErrors(metadataMutation.error),
  ];

  if (!channelPaymentOptions) {
    return (
      <ErrorDetails
        error={intl.formatMessage(
          notFoundMessages.channelPaymentOptionsNotFound
        )}
      />
    );
  }

  return (
    <ChannelDetails
      channelPaymentOptions={channelPaymentOptions}
      channels={channels}
      saveButtonBarState="default"
      loading={
        channelsQuery.fetching ||
        metafieldsQuery.fetching ||
        metadataMutation.fetching
      }
      errors={errors}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
};
export default Channel;
