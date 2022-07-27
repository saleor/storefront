import React from "react";
import { Checkbox as UiKitCheckbox, CheckboxProps as UiKitCheckboxProps } from "@saleor/ui-kit";

interface CheckboxProps extends Omit<UiKitCheckboxProps, "onChange"> {
  onChange: (value: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ onChange, ...rest }) => {
  const { checked } = rest;

  return <UiKitCheckbox onChange={() => onChange(!checked)} {...rest} />;
};
