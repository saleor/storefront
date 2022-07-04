import ErrorDetails from "@/checkout-app/frontend/components/templates/ErrorDetails";
import { useChannelPaymentOptions } from "@/checkout-app/frontend/data";
import { useAuthData } from "@/checkout-app/frontend/hooks/useAuthData";
import { notFoundMessages } from "@/checkout-app/frontend/misc/errorMessages";
import { mapPublicMetafieldsToSettings } from "@/checkout-app/frontend/misc/mapPublicMetafieldsToSettings";
import { mapPublicSettingsToMetadata } from "@/checkout-app/frontend/misc/mapPublicSettingsToMetadata";
import { getCommonErrors } from "@/checkout-app/frontend/utils";
import {
  useChannelsQuery,
  usePublicMetafieldsQuery,
  useUpdatePublicMetadataMutation,
} from "@/checkout-app/graphql";
import { PublicSettingID } from "@/checkout-app/types/common";
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
      id: appId,
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
      id: appId,
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
