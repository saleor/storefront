import { Children } from "@/checkout-storefront/lib/globalTypes";
import { Provider as UrqlProvider } from "urql";

export const getMockUrqlProvider =
  (mockedResponseState: any) =>
  /* eslint-disable-next-line react/display-name */
  ({ children }: Children) =>
    <UrqlProvider value={mockedResponseState}>{children}</UrqlProvider>;
