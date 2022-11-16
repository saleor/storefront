import { Children } from "@/checkout-storefront/lib/globalTypes";
import { DEFAULT_LOCALE } from "@/checkout-storefront/lib/regions";
import { IntlProvider } from "react-intl";
import { Provider as UrqlProvider } from "urql";

export const getMockProviders = ({ mockedResponseState }: { mockedResponseState?: any } = {}) => {
  const MockIntlProvider = ({ children }: Children) => (
    <IntlProvider defaultLocale={DEFAULT_LOCALE} locale={DEFAULT_LOCALE}>
      {children}
    </IntlProvider>
  );

  const MockProvider = ({ children }: Children) => {
    if (mockedResponseState) {
      return (
        <MockIntlProvider>
          <UrqlProvider value={mockedResponseState}>{children}</UrqlProvider>
        </MockIntlProvider>
      );
    } else {
      return <MockIntlProvider>{children}</MockIntlProvider>;
    }
  };

  return MockProvider;
};
