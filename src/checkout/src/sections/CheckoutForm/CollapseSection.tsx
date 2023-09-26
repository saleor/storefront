import { type Children } from "@/checkout/src/lib/globalTypes";

interface CollapseSectionProps extends Children {
  collapse: boolean;
}

export const CollapseSection = ({ collapse, children }: CollapseSectionProps) => {
  if (collapse) {
    return null;
  }

  return <>{children}</>;
};
