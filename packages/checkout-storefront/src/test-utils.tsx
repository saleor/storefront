import { Children } from "@/checkout-storefront/lib/globalTypes";
import { Provider as UrqlProvider } from "urql";

export const getMockUrqlProvider = (mockedResponseState: any) => {
  const MockProvider = ({ children }: Children) => (
    <UrqlProvider value={mockedResponseState}>{children}</UrqlProvider>
  );

  return MockProvider;
};
