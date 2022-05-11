import { ReactNode } from "react";

import { Text } from "@saleor/ui-kit";

export const SectionTitle = ({ children }: { children: ReactNode }) => (
  <Text size="lg" weight="bold" className="mb-2">
    {children}
  </Text>
);

export const Section = ({ children }: { children: ReactNode }) => (
  <div className="mb-6">{children}</div>
);
