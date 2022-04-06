import ColorInput from "@frontend/components/elements/ColorInput";
import FileInput from "@frontend/components/elements/FileInput";
import { TextField } from "@material-ui/core";
import { SettingType } from "types/common";

interface SettingProps {
  name: string;
  type: SettingType;
  label: string;
  value?: string;
  onChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.DragEvent<HTMLDivElement>
  ) => void;
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
