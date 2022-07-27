import { useRouter } from "next/router";
import CustomizationDetails from "@/saleor-app-checkout/frontend/components/templates/CustomizationDetails";
import { CustomizationSettingsFiles, CustomizationSettingsValues } from "types/api";
import {
  useFileUploadMutation,
  usePublicMetafieldsQuery,
  useUpdatePublicMetadataMutation,
} from "@/saleor-app-checkout/graphql";
import { getCommonErrors, getMetafield } from "@/saleor-app-checkout/frontend/utils";
import { useCustomizationSettings } from "@/saleor-app-checkout/frontend/data";
import { useAuthData } from "@/saleor-app-checkout/frontend/hooks/useAuthData";
import {
  mapPublicMetafieldsToMetadata,
  mapPublicSettingsToMetadata,
} from "@/saleor-app-checkout/frontend/misc/mapPublicSettingsToMetadata";
import { mapPublicMetafieldsToSettings } from "@/saleor-app-checkout/frontend/misc/mapPublicMetafieldsToSettings";
import { PublicMetafieldID } from "@/saleor-app-checkout/types/common";
import { uploadSettingsFiles } from "@/saleor-app-checkout/frontend/handlers";

const Customization = () => {
  const router = useRouter();
  const { appId, isAuthorized } = useAuthData();
  const [metafieldsQuery] = usePublicMetafieldsQuery({
    variables: {
      id: appId,
      keys: ["customizations", "customizationsCheckoutUrl"] as PublicMetafieldID[number][],
    },
    pause: !isAuthorized,
  });
  const [metadataMutation, setPublicMetadata] = useUpdatePublicMetadataMutation();
  const [uploadFileState, uploadFile] = useFileUploadMutation();

  const settingsValues = mapPublicMetafieldsToSettings(metafieldsQuery.data?.app?.metafields || {});
  const customizationSettings = useCustomizationSettings(settingsValues.customizations);

  const checkoutUrl = getMetafield(
    metafieldsQuery.data?.app?.metafields || {},
    "customizationsCheckoutUrl"
  );

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (
    data: CustomizationSettingsValues,
    dataFiles?: CustomizationSettingsFiles,
    checkoutUrl?: string
  ) => {
    const newData = await uploadSettingsFiles({ data, dataFiles, uploadFile });

    const metadata = [
      ...mapPublicSettingsToMetadata({
        customizations: newData,
      }),
      ...mapPublicMetafieldsToMetadata({
        customizationsCheckoutUrl: checkoutUrl,
      }),
    ];

    await setPublicMetadata({
      id: appId,
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
      checkoutUrl={checkoutUrl}
      loading={metafieldsQuery.fetching || metadataMutation.fetching || uploadFileState.fetching}
      saveButtonBarState="default"
      errors={errors}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
};
export default Customization;
