import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { ControlFormData } from "@/checkout-storefront/hooks/useGetInputProps";
import { EyeHiddenIcon, EyeIcon } from "@/checkout-storefront/icons";
import { ForwardedRef, forwardRef, useState } from "react";
import { Control } from "react-hook-form";
import { IconButton } from "@/checkout-storefront/components/IconButton";
import { TextInput, TextInputProps } from "@/checkout-storefront/components/TextInput";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { labels } from "@/checkout-storefront/components/PasswordInput/messages";

const PasswordInputComponent = <
  TControl extends Control<any, any>,
  TFormData extends ControlFormData<TControl>
>(
  props: TextInputProps<TControl, TFormData>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const formatMessage = useFormattedMessages();
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative">
      <TextInput ref={ref} {...props} type={passwordVisible ? "text" : "password"} />
      <div className="password-input-icon">
        <IconButton
          variant="bare"
          ariaLabel={formatMessage(labels.passwordVisibility)}
          onClick={() => setPasswordVisible(!passwordVisible)}
          icon={
            <img src={passwordVisible ? getSvgSrc(EyeIcon) : getSvgSrc(EyeHiddenIcon)} alt="" />
          }
        />
      </div>
    </div>
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
