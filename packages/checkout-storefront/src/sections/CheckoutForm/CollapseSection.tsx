import { Children } from "@/checkout-storefront/lib/globalTypes";

interface CollapseSectionProps extends Children {
  collapse: boolean;
}

export const CollapseSection = ({ collapse, children }: CollapseSectionProps) => {
  if (collapse) {
    return null;
  }

  return <>{children}</>;
};
