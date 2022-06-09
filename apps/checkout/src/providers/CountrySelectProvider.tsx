import React, { PropsWithChildren, useState } from "react";
import { createSafeContext } from "@/checkout/providers/createSafeContext";
import { AddressFragment, CountryCode } from "@/checkout/graphql";

const defaultCountryCode: CountryCode = "PL";

interface CountrySelectProviderProps {
  selectedCountryCode?: CountryCode;
}

export interface CountrySelectContextConsumerProps {
  countryCode: CountryCode;
  setCountryCode: (code?: CountryCode) => void;
  setCountryCodeFromAddress: (address?: AddressFragment | null) => void;
}

export const [useCountrySelect, Provider] =
  createSafeContext<CountrySelectContextConsumerProps>();

export const CountrySelectProvider: React.FC<
  PropsWithChildren<CountrySelectProviderProps>
> = ({ children, selectedCountryCode }) => {
  const [countryCode, setCountryCode] = useState<CountryCode>(
    selectedCountryCode || defaultCountryCode
  );

  const handleSetCountryCode = (code: CountryCode = defaultCountryCode) =>
    setCountryCode(code);

  const setCountryCodeFromAddress = (address?: AddressFragment | null) =>
    setCountryCode(address?.country?.code as CountryCode);

  const providerValues: CountrySelectContextConsumerProps = {
    countryCode,
    setCountryCode: handleSetCountryCode,
    setCountryCodeFromAddress,
  };

  return <Provider value={providerValues}>{children}</Provider>;
};
