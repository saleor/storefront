import React from "react";
import {
  Button as UiKitButton,
  ButtonProps as UiKitButtonProps,
} from "@saleor/ui-kit";
import { AriaLabel } from "@/lib/globalTypes";

export type ButtonProps = UiKitButtonProps & AriaLabel;

export const Button: React.FC<ButtonProps> = ({ ariaLabel, ...rest }) => {
  return <UiKitButton {...rest} aria-label={ariaLabel} />;
};
