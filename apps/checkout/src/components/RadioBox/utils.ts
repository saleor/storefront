import { handleInputChange } from "@/lib/utils";
import { RadioProps } from "@saleor/ui-kit";
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
