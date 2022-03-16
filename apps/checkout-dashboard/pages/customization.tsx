import { useRouter } from "next/router";
import CustomizationDetails from "@templates/CustomizationDetails";
import { getCustomizationSettings } from "api/app";
import { UnknownSettingsValues } from "types/api";

export default function Customization() {
  const router = useRouter();
  const options = getCustomizationSettings();

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = (data: UnknownSettingsValues) => {
    console.log(data);
  };

  return (
    <CustomizationDetails
      options={options}
      disabled={false}
      saveButtonBarState="default"
      onCanel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
}
