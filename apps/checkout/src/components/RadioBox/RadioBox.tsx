import React from "react";
import {
  Text,
  Radio as UiKitRadio,
  RadioProps as UiKitRadioProps,
} from "@saleor/ui-kit";
import { getRadioPropsFromRadioBoxProps } from "./utils";
import clsx from "clsx";
import "./RadioBoxStyles.css";

export interface RadioBoxProps
  extends Omit<UiKitRadioProps, "onSelect" | "label"> {
  onSelect: (value: string) => void;
  selectedValue: string | undefined;
  subtitle?: string;
}

export const RadioBox: React.FC<RadioBoxProps> = ({ subtitle, ...rest }) => {
  const radioProps = getRadioPropsFromRadioBoxProps(rest);

  return (
    <div className={clsx("radio-box", radioProps.checked && "selected")}>
      <UiKitRadio {...radioProps} classNames={{ container: "!mb-0" }} />
      {subtitle && <Text>{subtitle}</Text>}
    </div>
  );
};
