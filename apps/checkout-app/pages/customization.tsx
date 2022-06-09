import { useRouter } from "next/router";
import CustomizationDetails from "@/checkout-app/frontend/components/templates/CustomizationDetails";
import { CustomizationSettingsValues } from "types/api";
import {
  usePublicMetafieldsQuery,
  useUpdatePublicMetadataMutation,
} from "@/checkout-app/graphql";
import { getCommonErrors } from "@/checkout-app/frontend/utils";
import { useCustomizationSettings } from "@/checkout-app/frontend/data";
import { useAuthData } from "@/checkout-app/frontend/hooks/useAuthData";
import { serverEnvVars } from "@/checkout-app/constants";
import { mapPublicSettingsToMetadata } from "@/checkout-app/frontend/misc/mapPublicSettingsToMetadata";
import { mapPublicMetafieldsToSettings } from "@/checkout-app/frontend/misc/mapPublicMetafieldsToSettings";
import { PublicSettingID } from "@/checkout-app/types/common";

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
