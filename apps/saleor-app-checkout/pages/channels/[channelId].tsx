import ErrorDetails from "@/saleor-app-checkout/frontend/components/templates/ErrorDetails";
import { useChannelPaymentOptions } from "@/saleor-app-checkout/frontend/data";
import { useAuthData } from "@/saleor-app-checkout/frontend/hooks/useAuthData";
import { notFoundMessages } from "@/saleor-app-checkout/frontend/misc/errorMessages";
import { mapPublicMetafieldsToSettings } from "@/saleor-app-checkout/frontend/misc/mapPublicMetafieldsToSettings";
import { mapPublicSettingsToMetadata } from "@/saleor-app-checkout/frontend/misc/mapPublicSettingsToMetadata";
import { getCommonErrors } from "@/saleor-app-checkout/frontend/utils";
import {
  useChannelsQuery,
  usePublicMetafieldsQuery,
  useUpdatePublicMetadataMutation,
} from "@/saleor-app-checkout/graphql";
import { PublicSettingID } from "@/saleor-app-checkout/types/common";
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
  const [metadataMutation, setPublicMetadata] = useUpdatePublicMetadataMutation();

  const settingsValues = mapPublicMetafieldsToSettings(metafieldsQuery.data?.app?.metafields || {});

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

    void setPublicMetadata({
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
      <ErrorDetails error={intl.formatMessage(notFoundMessages.channelPaymentOptionsNotFound)} />
    );
  }

  return (
    <ChannelDetails
      channelPaymentOptions={channelPaymentOptions}
      channels={channels}
      saveButtonBarState="default"
      loading={channelsQuery.fetching || metafieldsQuery.fetching || metadataMutation.fetching}
      errors={errors}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
};
export default Channel;
