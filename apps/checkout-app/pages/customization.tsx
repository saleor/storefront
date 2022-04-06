import { useRouter } from "next/router";
import CustomizationDetails from "@frontend/components/templates/CustomizationDetails";
import { CustomizationSettingsValues } from "types/api";
import {
  usePrivateMetadataQuery,
  useUpdatePrivateMetadataMutation,
} from "@graphql";
import { mapMetadataToSettings, mapSettingsToMetadata } from "@frontend/utils";
import { getCustomizationSettings } from "@frontend/data";
import { useAuthData } from "@frontend/hooks/useAuthData";

const Customization = () => {
  const router = useRouter();
  const { app } = useAuthData();
  const [metadataQuery] = usePrivateMetadataQuery({
    variables: {
      id: app,
    },
  });
  const [metadataMutation, setPrivateMetadata] =
    useUpdatePrivateMetadataMutation();

  const settingsValues = mapMetadataToSettings(
    metadataQuery.data?.app?.privateMetadata || []
  );
  const customizationSettings = getCustomizationSettings(
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
      id: app,
      input: metadata,
    });
  };

  return (
    <CustomizationDetails
      options={customizationSettings}
      loading={metadataQuery.fetching || metadataMutation.fetching}
      saveButtonBarState="default"
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
};
export default Customization;
