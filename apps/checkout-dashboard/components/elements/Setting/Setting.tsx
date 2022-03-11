import ColorInput from "@elements/ColorInput";
import FileInput from "@elements/FileInput";
import { TextField } from "@material-ui/core";
import { SettingType } from "types";

interface SettingProps {
  type: SettingType;
  label: string;
  value?: string;
}

const Setting: React.FC<SettingProps> = ({ type, label, value }) => {
  if (type === "string") {
    return <TextField label={label} value={value} fullWidth={true} />;
  }
  if (type === "color") {
    return <ColorInput label={label} value={value} />;
  }
  if (type === "image") {
    return (
      <FileInput
        label={label}
        fileUrl={value}
        onFileUpload={() => undefined}
        onFileDelete={() => undefined}
      />
    );
  }
  return null;
};
export default Setting;
