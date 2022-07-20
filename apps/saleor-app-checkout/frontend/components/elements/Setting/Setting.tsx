import ColorInput from "@/saleor-app-checkout/frontend/components/elements/ColorInput";
import FileInput from "@/saleor-app-checkout/frontend/components/elements/FileInput";
import { TextField } from "@material-ui/core";
import { SettingType } from "checkout-common";

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
  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const Setting: React.FC<SettingProps> = ({
  name,
  type,
  label,
  value,
  onChange,
  onFileChange,
  onBlur,
}) => {
  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.DragEvent<HTMLDivElement>
  ) => {
    onChange(event);

    if (type === "image") {
      onFileChange &&
        onFileChange(event as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const commonProps = {
    name,
    label,
    value,
    onChange: handleChange,
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
