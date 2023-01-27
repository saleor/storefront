import React from "react";
import { Button as UiKitButton, ButtonProps as UiKitButtonProps } from "@saleor/ui-kit";
import { AriaLabel } from "@/checkout-storefront/lib/globalTypes";

export interface ButtonProps extends UiKitButtonProps, AriaLabel {}

export const Button: React.FC<ButtonProps> = ({ ariaLabel, ...rest }) => {
  return <UiKitButton {...rest} aria-label={ariaLabel} />;
};
