import React from "react";
import { Button as UiKitButton, type ButtonProps as UiKitButtonProps } from "@/checkout/ui-kit";
import { type AriaLabel } from "@/checkout/src/lib/globalTypes";

export interface ButtonProps extends UiKitButtonProps, AriaLabel {}

export const Button: React.FC<ButtonProps> = ({ ariaLabel, ...rest }) => {
  return <UiKitButton {...rest} aria-label={ariaLabel} />;
};
