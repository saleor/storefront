import ColorInput from "@elements/ColorInput";
import FileInput from "@elements/FileInput";
import { TextField } from "@material-ui/core";
import { SettingType } from "types";

interface SettingProps {
  name: string;
  type: SettingType;
  label: string;
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const Setting: React.FC<SettingProps> = ({
  name,
  type,
  label,
  value,
  onChange,
  onBlur,
}) => {
  const commonProps = {
    name,
    label,
    value,
    onChange,
    onBlur,
  };

  if (type === "string") {
    return <TextField {...commonProps} fullWidth />;
  }
  if (type === "color") {
    return <ColorInput {...commonProps} />;
  }
  if (type === "image") {
    return <FileInput {...commonProps} alt={label} />;
  }
  return null;
};
export default Setting;
