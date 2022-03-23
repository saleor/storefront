import { useFormattedMessages } from "@hooks/useFormattedMessages";
import { ControlFormData } from "@hooks/useGetInputProps";
import { EyeHiddenIcon, EyeIcon } from "@icons";
import { ForwardedRef, useState } from "react";
import { forwardRef } from "react";
import { Control } from "react-hook-form";
import { IconButton } from "./IconButton";
import { TextInput, TextInputProps } from "./TextInput";

export const PasswordInputComponent = <
  TControl extends Control<any, any>,
  TFormData extends ControlFormData<TControl>
>(
  props: TextInputProps<TControl, TFormData>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const formatMessage = useFormattedMessages();
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <TextInput
      {...props}
      type={passwordVisible ? "text" : "password"}
      ref={ref}
      icon={
        <IconButton
          ariaLabel={formatMessage("passwordVisibilityLabel")}
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          <img src={passwordVisible ? EyeIcon : EyeHiddenIcon} alt="" />
        </IconButton>
      }
    />
  );
};

export const PasswordInput = forwardRef(PasswordInputComponent) as <
  TControl extends Control<any, any>,
  TFormData extends ControlFormData<TControl>
>(
  props: TextInputProps<TControl, TFormData> & {
    ref?: React.ForwardedRef<HTMLInputElement>;
  }
) => ReturnType<typeof PasswordInputComponent>;
