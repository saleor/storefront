import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { EyeHiddenIcon, EyeIcon } from "@/checkout-storefront/icons";
import { IconButton } from "@/checkout-storefront/components/IconButton";
import { TextInput, TextInputProps } from "@/checkout-storefront/components/TextInput";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { labels } from "@/checkout-storefront/components/PasswordInput/messages";
import { useState } from "react";

export const PasswordInput = <TName extends string>(props: TextInputProps<TName>) => {
  const formatMessage = useFormattedMessages();
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative">
      <TextInput {...props} type={passwordVisible ? "text" : "password"} />
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
