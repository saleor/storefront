import { RadioClassNames } from "@saleor/ui-kit";
import clsx from "clsx";

export const useRadioBoxStyles =
  (selected?: boolean) =>
  ({ container }: RadioClassNames = {}) => ({
    container: clsx("radio-box", selected && "selected", container),
    label: "py-6 px-6",
  });
