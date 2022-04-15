import { Title } from "@/components/Title";
import { CountryCode } from "@/graphql";
import React, { PropsWithChildren } from "react";
import { countries } from "./countries";

interface UserAddressSectionContainerProps {
  title: string;
  displayCountrySelect: boolean;
  selectedCountryCode: CountryCode;
  onCountrySelect: (countryCode: CountryCode) => void;
}

export const UserAddressSectionContainer: React.FC<
  PropsWithChildren<UserAddressSectionContainerProps>
> = ({
  selectedCountryCode,
  title,
  children,
  displayCountrySelect,
  onCountrySelect,
}) => {
  return (
    <div className="my-6">
      <div className="flex flex-row justify-between">
        <Title>{title}</Title>
        {displayCountrySelect && (
          <select
            onChange={(event) => {
              onCountrySelect(event.target.value as CountryCode);
            }}
          >
            {countries.map(({ name, code }) => (
              <option value={code} selected={selectedCountryCode === code}>
                {name}
              </option>
            ))}
          </select>
        )}
      </div>
      {children}
    </div>
  );
};
