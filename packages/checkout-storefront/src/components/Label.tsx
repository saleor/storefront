import { Label as UiKitLabel, LabelProps as UiKitLabelProps } from "@saleor/ui-kit";
import React from "react";

interface LabelProps extends UiKitLabelProps {
  htmlFor: string;
}

export const Label: React.FC<LabelProps> = ({ ...rest }) => <UiKitLabel {...rest} />;
