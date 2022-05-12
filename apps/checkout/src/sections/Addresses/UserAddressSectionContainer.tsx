import { Title } from "@/components/Title";
import { CountryCode } from "@/graphql";
import React, { PropsWithChildren } from "react";
import { countries } from "./countries";
import { Select } from "@saleor/ui-kit";

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
      <div className="flex flex-row justify-between items-baseline mb-3">
        <Title>{title}</Title>
        {displayCountrySelect && (
          <Select
            classNames={{ container: "!w-1/3" }}
            onChange={onCountrySelect}
            selectedValue={selectedCountryCode}
            options={countries.map(({ name, code }) => ({
              label: name,
              value: code,
            }))}
          />
        )}
      </div>
      {children}
    </div>
  );
};
