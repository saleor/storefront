import { Text } from "@/checkout/ui-kit";
import { type FC, type ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  title: string;
}

export const Section: FC<SectionProps> = ({ children, title }) => (
  <div className="mb-6">
    <Text weight="bold" color="secondary" className="mb-2">
      {title}
    </Text>
    {children}
  </div>
);
