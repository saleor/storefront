import React from "react";
import { Label as UiKitLabel, type LabelProps as UiKitLabelProps } from "@/checkout/ui-kit";

interface LabelProps extends UiKitLabelProps {
  htmlFor: string;
}

export const Label: React.FC<LabelProps> = ({ ...rest }) => <UiKitLabel {...rest} />;
