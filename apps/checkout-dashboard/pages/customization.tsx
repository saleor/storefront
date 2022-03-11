import CustomizationDetails from "@templates/CustomizationDetails";
import { useCustomizationSettings } from "api/app/api";

export default function Customization() {
  const options = useCustomizationSettings();

  return <CustomizationDetails options={options} />;
}
