import { useRouter } from "next/router";
import CustomizationDetails from "@/frontend/components/templates/CustomizationDetails";
import { CustomizationSettingsValues } from "types/api";
import {
  usePublicMetadataQuery,
  useUpdatePublicMetadataMutation,
} from "@/graphql";
import { getCommonErrors } from "@/frontend/utils";
import { useCustomizationSettings } from "@/frontend/data";
import { useAuthData } from "@/frontend/hooks/useAuthData";
import { serverEnvVars } from "@/constants";
import { mapPublicSettingsToMetadata } from "@/frontend/misc/mapPublicSettingsToMetadata";
import { mapPublicMetadataToSettings } from "@/frontend/misc/mapPublicMetadataToSettings";

const Customization = () => {
  const router = useRouter();
  const { appId, isAuthorized } = useAuthData();
  const [metadataQuery] = usePublicMetadataQuery({
    variables: {
      id: appId || serverEnvVars.appId,
    },
    pause: !isAuthorized,
  });
  const [metadataMutation, setPublicMetadata] =
    useUpdatePublicMetadataMutation();

  const settingsValues = mapPublicMetadataToSettings(
    metadataQuery.data?.app?.metadata || []
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
      loading={metadataQuery.fetching || metadataMutation.fetching}
      saveButtonBarState="default"
      errors={errors}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
};
export default Customization;
