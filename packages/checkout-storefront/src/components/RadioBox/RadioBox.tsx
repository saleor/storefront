import React from "react";
import {
  Text,
  Radio as UiKitRadio,
  RadioProps as UiKitRadioProps,
} from "@saleor/ui-kit";
import { getRadioPropsFromRadioBoxProps, useRadioBoxStyles } from "./utils";
import "./RadioBoxStyles.css";

export interface RadioBoxProps
  extends Omit<UiKitRadioProps, "onSelect" | "label"> {
  onSelect: (value: string) => void;
  selectedValue: string | undefined;
  subtitle?: string;
}

export const RadioBox: React.FC<RadioBoxProps> = ({ subtitle, ...rest }) => {
  const radioProps = getRadioPropsFromRadioBoxProps(rest);
  const getRadioBoxClasses = useRadioBoxStyles(radioProps.checked);

  return (
    <div className={getRadioBoxClasses().container}>
      <UiKitRadio
        {...radioProps}
        classNames={{ container: "!mb-0", label: getRadioBoxClasses().label }}
      />
      {subtitle && <Text>{subtitle}</Text>}
    </div>
  );
};
