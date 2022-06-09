import { handleInputChange } from "@/checkout/lib/utils";
import { RadioProps, RadioClassNames } from "@saleor/ui-kit";
import clsx from "clsx";
import { RadioBoxProps } from "./RadioBox";

export const getRadioPropsFromRadioBoxProps = ({
  title,
  onSelect,
  selectedValue,
  ...rest
}: RadioBoxProps): RadioProps => {
  const { value } = rest;

  return {
    ...rest,
    label: title,
    onChange: handleInputChange(onSelect),
    checked: selectedValue === value,
  };
};

export const useRadioBoxStyles =
  (selected?: boolean) =>
  ({ container }: RadioClassNames = {}) => ({
    container: clsx("radio-box", selected && "selected", container),
    label: "py-6 px-6",
  });
