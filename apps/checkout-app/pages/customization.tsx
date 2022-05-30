import { useRouter } from "next/router";
import CustomizationDetails from "@/frontend/components/templates/CustomizationDetails";
import { CustomizationSettingsValues } from "types/api";
import {
  usePublicMetafieldsQuery,
  useUpdatePublicMetadataMutation,
} from "@/graphql";
import { getCommonErrors } from "@/frontend/utils";
import { useCustomizationSettings } from "@/frontend/data";
import { useAuthData } from "@/frontend/hooks/useAuthData";
import { serverEnvVars } from "@/constants";
import { mapPublicSettingsToMetadata } from "@/frontend/misc/mapPublicSettingsToMetadata";
import { mapPublicMetafieldsToSettings } from "@/frontend/misc/mapPublicMetafieldsToSettings";
import { PublicSettingID } from "@/types/common";

const Customization = () => {
  const router = useRouter();
  const { appId, isAuthorized } = useAuthData();
  const [metafieldsQuery] = usePublicMetafieldsQuery({
    variables: {
      id: appId || serverEnvVars.appId,
      keys: ["customizations"] as PublicSettingID[number][],
    },
    pause: !isAuthorized,
  });
  const [metadataMutation, setPublicMetadata] =
    useUpdatePublicMetadataMutation();

  const settingsValues = mapPublicMetafieldsToSettings(
    metafieldsQuery.data?.app?.metafields || {}
  );
  const customizationSettings = useCustomizationSettings(
    settingsValues.customizations
  );

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = (data: CustomizationSettingsValues) => {
    const metadata = mapPublicSettingsToMetadata({
      customizations: data,
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

  return (
    <CustomizationDetails
      options={customizationSettings}
      loading={metafieldsQuery.fetching || metadataMutation.fetching}
      saveButtonBarState="default"
      errors={errors}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
};
export default Customization;
