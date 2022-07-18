import React from "react";
import {
  Button as UiKitButton,
  ButtonProps as UiKitButtonProps,
} from "@saleor/ui-kit";
import { AriaLabel } from "@/checkout/lib/globalTypes";

export interface ButtonProps extends UiKitButtonProps, AriaLabel {
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | Promise<void>;
}

export const Button: React.FC<ButtonProps> = ({
  ariaLabel,
  onClick,
  ...rest
}) => {
  return (
    <UiKitButton
      {...rest}
      aria-label={ariaLabel}
      onClick={
        onClick as (
          event: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) => void
      }
    />
  );
};
