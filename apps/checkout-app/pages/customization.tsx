import { useRouter } from "next/router";
import CustomizationDetails from "frontend/components/templates/CustomizationDetails";
import { getCustomizationSettings } from "mocks/app";
import { UnknownSettingsValues } from "types/api";
import { withUrqlClient } from "next-urql";
// import { useCustomizationSettings } from "@hooks/useCustomizationSettings";

const Customization = () => {
  const router = useRouter();
  const options = getCustomizationSettings();
  // const options = useCustomizationSettings();

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
};
export default withUrqlClient(() => ({
  url: process.env.NEXT_PUBLIC_API_URL,
}))(Customization);
