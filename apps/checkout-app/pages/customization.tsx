import { useRouter } from "next/router";
import CustomizationDetails from "@/frontend/components/templates/CustomizationDetails";
import { CustomizationSettingsValues } from "types/api";
import {
  usePrivateMetadataQuery,
  useUpdatePrivateMetadataMutation,
} from "@/graphql";
import {
  getCommonErrors,
  mapMetadataToSettings,
  mapSettingsToMetadata,
} from "@/frontend/utils";
import { useCustomizationSettings } from "@/frontend/data";
import { useAuthData } from "@/frontend/hooks/useAuthData";
import { serverEnvVars } from "@/constants";

const Customization = () => {
  const router = useRouter();
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
  const customizationSettings = useCustomizationSettings(
    settingsValues.customizations
  );

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = (data: CustomizationSettingsValues) => {
    const metadata = mapSettingsToMetadata({
      customizations: data,
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
