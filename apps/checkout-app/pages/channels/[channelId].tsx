import { serverEnvVars } from "@/constants";
import ErrorDetails from "@/frontend/components/templates/ErrorDetails";
import { useChannelPaymentOptions } from "@/frontend/data";
import { useAuthData } from "@/frontend/hooks/useAuthData";
import { notFoundMessages } from "@/frontend/misc/errorMessages";
import {
  getCommonErrors,
  mapMetadataToSettings,
  mapSettingsToMetadata,
} from "@/frontend/utils";
import {
  useChannelsQuery,
  usePrivateMetadataQuery,
  useUpdatePrivateMetadataMutation,
} from "@/graphql";
import ChannelDetails from "frontend/components/templates/ChannelDetails";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { ChannelActivePaymentProviders } from "types/api";

const Channel = () => {
  const router = useRouter();
  const { channelId } = router.query;
  const intl = useIntl();

  const { appId, isAuthorized } = useAuthData();
  const [metadataQuery] = usePrivateMetadataQuery({
    variables: {
      id: appId || serverEnvVars.appId,
    },
    pause: !isAuthorized,
  });
  const [metadataMutation, setPrivateMetadata] =
    useUpdatePrivateMetadataMutation();

  const settingsValues = mapMetadataToSettings(
    metadataQuery.data?.app?.privateMetadata || []
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
    const metadata = mapSettingsToMetadata({
      channelActivePaymentProviders: {
        ...settingsValues.channelActivePaymentProviders,
        ...data,
      },
    });

    setPrivateMetadata({
      id: appId || serverEnvVars.appId,
      input: metadata,
    });
  };

  const errors = [
    ...(metadataMutation.data?.updatePrivateMetadata?.errors || []),
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
        metadataQuery.fetching ||
        metadataMutation.fetching
      }
      errors={errors}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
};
export default Channel;
